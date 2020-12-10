const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Cart = require('./Cart')
const Order = require('./Order')
const { idToCursor } = require('../utils/relayCursor')

module.exports = new GraphQLObjectType({
  name: 'PlaceOrderPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    cart: {
      type: Cart
    },
    order: {
      type: Order
    },
    cursor: {
      type: GraphQLString,
      resolve: ({ order }) => {
        if(order) {
          return idToCursor(order._id)
        }

        return null
      }
    }
  }
})