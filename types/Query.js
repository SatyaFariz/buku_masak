const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const { forwardConnectionArgs } = require('graphql-relay')
const { GraphQLDateTime } = require('graphql-custom-types')

const mongoose = require('mongoose')

const Direction = require('./Direction')
const Unit = require('./Unit')
const Product = require('./Product')
const Category = require('./Category')
const User = require('./User')
const Cart = require('./Cart')
const Order = require('./Order')
const OrderStatusEnum = require('./OrderStatusEnum')
const OrderModel = require('../database/models/Order')
const Collection = require('./Collection')
const UnitModel = require('../database/models/Unit')
const ProductModel = require('../database/models/Product')
const CategoryModel = require('../database/models/Category')
const UserModel = require('../database/models/User')
const CartModel = require('../database/models/Cart')
const CollectionModel = require('../database/models/Collection')
const ProductConnection = require('./ProductConnection')
const AppConfigModel = require('../database/models/AppConfig')
const AppConfig = require('./AppConfig')
const AppUpdate = require('./AppUpdate')
const MobileAppTypeEnum = require('./MobileAppTypeEnum')
const PlatformEnum = require('./PlatformEnum')
const OrderConnection = require('./OrderConnection')
const GooglePlaceSearchPrediction = require('./GooglePlaceSearchPrediction')
const GooglePlace = require('./GooglePlace')
const CoordinateInput = require('./CoordinateInput')
const DateRangeInput = require('./DateRangeInput')

const mysql = require('mysql')
const mysqlConnection = require('../database/mysql')

const connectionFrom = require('../utils/connectionFrom')
const searchProducts = require('../utils/searchProducts')
const ProductLoader = require('../dataloader/ProductLoader')
const getOrdersByUserId = require('../utils/getOrdersByUserId')
//const getOrdersByDeliveryDate = require('../utils/getOrdersByDeliveryDate')
const getOrders = require('../utils/getOrders')
const userType = require('../constants/userType')
const searchGoogleMaps = require('../utils/searchGoogleMaps')
const getGooglePlace = require('../utils/getGooglePlace')
const getDirection = require('../utils/getDirection')
const orderStatus = require('../constants/orderStatus')
const getUpcomingOffDays = require('../utils/getUpcomingOffDays')
const ListDirectionEnum = require('./ListDirectionEnum')

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    me: {
      type: User,
      resolve: async (_, __, { session: { user }}) => {
        if(user) {
          return await UserModel.findById(mongoose.Types.ObjectId(user.id))
        }

        return null
      } 
    },
    upcomingOffDays: {
      type: new GraphQLList(GraphQLString),
      resolve: getUpcomingOffDays
    },
    appUpdate: {
      type: AppUpdate,
      args: {
        version: { type: new GraphQLNonNull(GraphQLString) },
        app: { type: new GraphQLNonNull(MobileAppTypeEnum) },
        platform: { type: new GraphQLNonNull(PlatformEnum) }
      },
      resolve: async (_, { version, app }) => {
        return new Promise((resolve, reject) => {
          const sql = mysql.format('CALL get_latest_android_version(?, ?)', [version, app])
      
          mysqlConnection.query(sql, (error, results, fields) => {
            if(error) {
              console.log(error)
            } else {
              resolve(results[0][0])
            }
            
          })
        })
      }
    },
    direction: {
      type: Direction,
      args: {
        origin: { type: new GraphQLNonNull(CoordinateInput) },
        orderId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { origin, orderId }, { session: { user }}) => {
        return user?.userType === userType.COURIER ? await getDirection(origin, orderId) : null
      }
    },
    appConfig: {
      type: AppConfig,
      resolve: async () => await AppConfigModel.findById('buku_masak')
    },
    units: { 
      type: new GraphQLList(Unit),
      resolve: async () => await UnitModel.find({})
    },
    categories: {
      type: new GraphQLList(Category),
      resolve: async (_, __, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        return await CategoryModel.find(isAdmin ? {} : { published: true })
      }
    },
    category: {
      type: Category,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await CategoryModel.findById(mongoose.Types.ObjectId(id))
    },
    product: {
      type: Product,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await ProductLoader.load(mongoose.Types.ObjectId(id))
    },
    order: {
      type: Order,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await OrderModel.findById(mongoose.Types.ObjectId(id))
    },
    search: {
      type: ProductConnection,
      args: {
        q: { type: new GraphQLNonNull(GraphQLString) },
        categoryId: { type: GraphQLString },
        ...forwardConnectionArgs
      },
      resolve: async (_, { first, after, q, categoryId }, { session: { user }}) => {
        return await connectionFrom(first, async (limit) => {
          const isAdmin = user?.userType === userType.ADMIN
          return await searchProducts({ q, limit, after, categoryId, published: isAdmin ? undefined : true })
        })
      }
    },
    searchGoogleMaps: {
      type: new GraphQLList(GooglePlaceSearchPrediction),
      args: {
        q: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { q }, ctx) => await searchGoogleMaps(q, ctx)
    },
    googlePlace: {
      type: GooglePlace,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }, ctx) => await getGooglePlace(id, ctx)
    },
    orders: {
      type: OrderConnection,
      args: {
        ...forwardConnectionArgs,
      //  dateRange: { type: DateRangeInput },
        startDate: { type: GraphQLDateTime },
        endDate: { type: GraphQLDateTime },
        searchQuery: { type: GraphQLString },
        status: { type: new GraphQLList(new GraphQLNonNull(OrderStatusEnum)) },
        direction: { type: ListDirectionEnum } 
      },
      resolve: async (_, { first, after, startDate, endDate, status, direction }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          if(user.userType === userType.CUSTOMER) {
            return await connectionFrom(first, async (limit) => 
              await getOrdersByUserId({ userId, limit, after })
            )
          } else if(user.userType === userType.COURIER) {
            if(!startDate && !endDate)
              throw new Error('Date range required')

            const statusIn = status || [orderStatus.PROCESSING, orderStatus.COMPLETED]

            return await connectionFrom(first, async (limit) => 
              await getOrders({
                startDate,
                endDate,
                statusIn,
                limit,
                after 
              })
            )
          } else if(user.userType === userType.ADMIN) {

            const statusNotIn = [orderStatus.DELETED]

            return await connectionFrom(first, async (limit) => 
              await getOrders({ 
                statusIn: status,
                startDate,
                endDate,
                statusNotIn,
                direction,
                limit, 
                after
              })
            )
          }
        }
      }
    },
    cart: {
      type: Cart,
      resolve: async (_, __, { session: { cartId }}) => {
        if(cartId) {
          return await CartModel.findOne({ cartId: mongoose.Types.ObjectId(cartId)})
        }

        return null
      }
    },
    collections: {
      type: new GraphQLList(Collection),
      resolve: async (_, __, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        return await CollectionModel.find(isAdmin ? {} : { published: true })
      }
    },
    collection: {
      type: Collection,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await CollectionModel.findById(mongoose.Types.ObjectId(id))
    }
  }
})