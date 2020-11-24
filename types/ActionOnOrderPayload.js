const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Order = require('./Order')

module.exports = new GraphQLObjectType({
  name: 'ActionOnOrderPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    order: {
      type: Order,
    },
  }
})