const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Cart = require('./Cart')

module.exports = new GraphQLObjectType({
  name: 'UpdateCartItemPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    cart: {
      type: Cart,
    },
  }
})