const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Cart = require('./Cart')

module.exports = new GraphQLObjectType({
  name: 'PlaceOrderPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    cart: {
      type: Cart
    },
  }
})