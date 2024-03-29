const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull
} = require('graphql')
const { forwardConnectionArgs } = require('graphql-relay')
const { GraphQLDateTime } = require('graphql-custom-types')

const mongoose = require('mongoose')

const Direction = require('./Direction')
const Label = require('./Label')
const Unit = require('./Unit')
const Product = require('./Product')
const Recipe = require('./Recipe')
const Category = require('./Category')
const User = require('./User')
const Cart = require('./Cart')
const Order = require('./Order')
const MenuItem = require('./MenuItem')
const OrderStatusEnum = require('./OrderStatusEnum')
const CollectionTypeEnum = require('./CollectionTypeEnum')
const OrderModel = require('../database/models/Order')
const RecipeModel = require('../database/models/Recipe')
const Collection = require('./Collection')
const UnitModel = require('../database/models/Unit')
const LabelModel = require('../database/models/Label')
const CategoryModel = require('../database/models/Category')
const UserModel = require('../database/models/User')
const CartModel = require('../database/models/Cart')
const CollectionModel = require('../database/models/Collection')
const NotificationModel = require('../database/models/Notification')
const ProductConnection = require('./ProductConnection')
const NotificationConnection = require('./NotificationConnection')
const AppConfigModel = require('../database/models/AppConfig')
const AppConfigLoader = require('../dataloader/AppConfigLoader')
const AppConfig = require('./AppConfig')
const AppUpdate = require('./AppUpdate')
const MobileAppTypeEnum = require('./MobileAppTypeEnum')
const PlatformEnum = require('./PlatformEnum')
const OrderConnection = require('./OrderConnection')
const GooglePlaceSearchPrediction = require('./GooglePlaceSearchPrediction')
const GooglePlace = require('./GooglePlace')
const CoordinateInput = require('./CoordinateInput')
const OrderItemSummaryConnection = require('./OrderItemSummaryConnection')

const mysql = require('mysql')
const mysqlConnection = require('../database/mysql')

const connectionFrom = require('../utils/connectionFrom')
const searchProducts = require('../utils/searchProducts')
const ProductLoader = require('../dataloader/ProductLoader')
const LabelLoader = require('../dataloader/LabelLoader')
const RecipeLoader = require('../dataloader/RecipeLoader')
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
const getUsers = require('../utils/getUsers')
const RecipeConnection = require('./RecipeConnection')
const UserConnection = require('./UserConnection')
const getOrderItemSummaries = require('../utils/getOrderItemSummaries')
const getNotifications = require('../utils/getNotifications')
const getRecipes = require('../utils/getRecipes')
const UserTypeEnum = require('./UserTypeEnum')

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
    orderItemSummaries: {
      type: OrderItemSummaryConnection,
      args: {
        ...forwardConnectionArgs,
        startDate: { type: new GraphQLNonNull(GraphQLDateTime) },
        endDate: { type: new GraphQLNonNull(GraphQLDateTime) }
      },
      resolve: async (_, { after, first, startDate, endDate }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          /*const productConnection = await connectionFrom(first, async (limit) => {
            return await searchProducts({ q: '', limit, after })
          })

          const products = productConnection.edges.map(item => item.node)
          const productIds = products.map(item => item._id)
          const orderItemSummaries = await getOrderItemSummaries(productIds)

          const edges = products.map(product => {
          //  const productId = item._id.toString()
            const orderItemSummary = orderItemSummaries.find(item => {
              const [productId] = item._id.split('_')
              return productId === product._id.toString()
            })
            return {
              node: {
                product,
                ...orderItemSummary
              }
            }
          })

          console.log(edges)
          productConnection.edges = edges
          return productConnection*/
          return await connectionFrom(first, async (limit) => {
            return await getOrderItemSummaries({ limit, after, startDate, endDate })
          })
        }
        
      }
    },
    appUpdate: {
      type: AppUpdate,
      args: {
        app: { type: new GraphQLNonNull(MobileAppTypeEnum) }
      },
      resolve: async (_, { app }, { req }) => {
        const { /*platform,*/ version } = req.headers
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
    labels: { 
      type: new GraphQLList(Label),
      resolve: async () => await LabelModel.find({})
    },
    label: { 
      type: Label,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await LabelLoader.load(mongoose.Types.ObjectId(id))
    },
    categories: {
      type: new GraphQLList(Category),
      resolve: async (_, __, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        return await CategoryModel.find(isAdmin ? {} : { published: true })
      }
    },
    menuItems: {
      type: new GraphQLList(MenuItem),
      resolve: async (_, __, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        const data = await Promise.all([
          CategoryModel.find(isAdmin ? {} : { published: true }),
          new Promise(async resolve => {
            const appConfig = await AppConfigLoader.load('buku_masak')
            resolve(appConfig.links)
          })
        ])

        return [].concat.apply([], data)
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
        published: { type: GraphQLBoolean },
        inStock: { type: GraphQLBoolean },
        sale: { type: GraphQLBoolean },
        ...forwardConnectionArgs
      },
      resolve: async (_, { first, after, q, categoryId, published, inStock, sale }, { session: { user }}) => {
        return await connectionFrom(first, async (limit) => {
          const isAdmin = user?.userType === userType.ADMIN
          return await searchProducts({ q, limit, after, categoryId, inStock, sale, published: isAdmin ? published : true })
        })
      }
    },
    users: {
      type: UserConnection,
      args: {
        ...forwardConnectionArgs,
        q: { type: GraphQLString },
        userType: { type: UserTypeEnum }
      },
      resolve: async (_, { first, after, q, userType: type }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) {
          return await connectionFrom(first, async (limit) => {
            return await getUsers({ 
              limit, 
              after,
              q,
              userType: type
            })
          })
        }
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
      args: {
        first: { type: GraphQLInt },
        type: { type: CollectionTypeEnum }
      },
      resolve: async (_, { first, type }, { session: { user }}) => {
        if(first < 1)
          return []

        const isAdmin = user?.userType === userType.ADMIN
        const options = {}
        const query = {}
        if(!isAdmin) {
          options.limit = first || 10
          query.published = true
        }

        if(type)
          query.type = type
        
        return await CollectionModel.find(query, null, options)
      }
    },
    collection: {
      type: Collection,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await CollectionModel.findById(mongoose.Types.ObjectId(id))
    },
    notifications: {
      type: NotificationConnection,
      args: {
        ...forwardConnectionArgs,
      },
      resolve: async (_, { first, after }, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          return await connectionFrom(first, async (limit) => {
            return await getNotifications({
              userId,
              limit, 
              after
            })
          })
        }
      }
    },
    recipes: {
      type: RecipeConnection,
      args: {
        ...forwardConnectionArgs,
        q: { type: GraphQLString },
        categoryIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLString))}
      },
      resolve: async (_, { first, after, q, categoryIds }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        return await connectionFrom(first, async (limit) => {
          return await getRecipes({
            q,
            published: isAdmin ? undefined : true,
            categoryIds,
            limit, 
            after
          })
        })
      }
    },
    recipe: {
      type: Recipe,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => await RecipeLoader.load(mongoose.Types.ObjectId(id))
    },
    unreadNotificationsCount: {
      type: GraphQLInt,
      resolve: async(_, __, { session: { user }}) => {
        if(user) {
          const userId = mongoose.Types.ObjectId(user.id)
          return await NotificationModel.count({
            to: userId,
            readBy: { '$ne': userId }
          })
        }
      }
    },
    ordersCount: {
      type: GraphQLInt,
      resolve: async(_, __, { session: { user }}) => {
        if(user && user.userType === userType.CUSTOMER) {
          const userId = mongoose.Types.ObjectId(user.id)
          return await OrderModel.count({
            userId,
            status: orderStatus.PROCESSING
          })
        }
      }
    },
    relatedItems: {
      type: new GraphQLList(Collection),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(CollectionTypeEnum) }
      },
      resolve: async (_, { id, type }, { session: { user }}) => {

        const isAdmin = user?.userType === userType.ADMIN
        const options = {}
        const query = {
          itemIds: id,
          type
        }
        if(!isAdmin) {
          options.limit = 2
          query.published = true
        }

        if(type === 'product') {
          options.limit = 1
          return new Promise(resolve => {
            CollectionModel.find(query, null, options).lean().exec(function (err, doc) {
              resolve(doc.map(item => ({ ...item, id: item._id, exclude: [id] })))
            })
          })
        } else if(type === 'recipe') {
          return new Promise(resolve => {
            const query = {
              childrenIds: id,
            }

            if(!isAdmin) {
              query.published = true
            }

            RecipeModel.find(query, null, options).lean().exec(function (err, doc) {
              resolve(doc.map(item => ({ 
                ...item, 
                id: `${item._id}_${id}`, // avoid Recipe and Collection conflict
                itemIds: item.childrenIds,
                exclude: [id] 
              })))
            })
          })
        }
        
      }
    }
  }
})