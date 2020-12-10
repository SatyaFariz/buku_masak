const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} = require('graphql')
const moment = require('moment')

const userType = require('../constants/userType')
const PaymentMethod = require('./PaymentMethod')
const DeliveryAddress = require('./DeliveryAddress')
const OrderItem = require('./OrderItem')
const User = require('./User')
const Image = require('./Image')

const UserLoader = require('../dataloader/UserLoader')
const OrderStatus = require('./OrderStatus')
const orderStatus = require('../constants/orderStatus')

const SHOW_MAX_ITEMS = 6

module.exports = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
      resolve: root => {
        const { length } = root.items
        const str = root.items.slice(...(length > SHOW_MAX_ITEMS ? [0, SHOW_MAX_ITEMS] : [])).map(item => {
          const { orderQty, product: { name, unit, unitQty }} = item
          return `${name} ${orderQty * unitQty} ${unit}`
        }).join(', ')

        return length > SHOW_MAX_ITEMS ? `${str}...` : str
      }
    },
    images: {
      type: new GraphQLList(Image),
      resolve: root => {
        const { length } = root.items
        return root.items.slice(...(length > SHOW_MAX_ITEMS ? [0, SHOW_MAX_ITEMS] : [])).map(item => item.product.image)
      }
    },
    deliveryFee: {
      type: GraphQLFloat,
    },
    status: {
      type: OrderStatus,
    },
    updatable: {
      type: GraphQLBoolean,
      resolve: (root, _, { session: { user }}) => {
        if(user?.userType === userType.ADMIN) {
          return true
        } else if(user?.userType === userType.COURIER) {
          return root.status === orderStatus.PROCESSING
        } else if(user?.userType === userType.CUSTOMER) {
          if(root.status === orderStatus.CANCELLED)
            return true
            
          const diff = moment(root.deliveryDate).startOf('day').diff(moment().startOf('day'), 'days')
          if(diff <= 1)
            return false

          return root.status === orderStatus.PROCESSING
        }

        return false
      }
    },
    deletable: {
      type: GraphQLBoolean,
      resolve: (root, _, { session: { user }}) => {
        if(user?.userType === userType.CUSTOMER) {
          return root.status === orderStatus.CANCELLED
        }

        return false
      }
    },
    packagingPrice: {
      type: GraphQLFloat,
    },
    totalPrice: {
      type: GraphQLFloat
    },
    deliveryDate: {
      type: GraphQLString,
      resolve: root => root.deliveryDate.toISOString() //moment(root.deliveryDate).format('DD MMMM YYYY')
    },
    deliveryAddress: {
      type: DeliveryAddress
    },
    paymentMethod: {
      type: PaymentMethod
    },
    items: {
      type: new GraphQLList(OrderItem)
    },
    createdAt: {
      type: GraphQLString,
      resolve: root => root.createdAt.toISOString() // moment(root.createdAt).format('DD MMMM, HH:mm')
    },
    user: {
      type: User,
      resolve: async root => await UserLoader.load(root.userId)
    },
    lastUpdatedBy: {
      type: User,
      resolve: async root => await UserLoader.load(root.lastUpdatedBy)
    },
  }
})