const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const DeliveryAddress = require('./DeliveryAddress')

module.exports = new GraphQLObjectType({
  name: 'ActionOnDeliveryAddressPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    deliveryAddress: {
      type: DeliveryAddress,
    },
  }
})