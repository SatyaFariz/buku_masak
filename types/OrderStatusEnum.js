const {
  GraphQLEnumType,
} = require('graphql')

const orderStatus = require('../constants/orderStatus')

module.exports = new GraphQLEnumType({
  name: 'OrderStatusEnum',
  values: {
    unreachable: {
      value: orderStatus.UNREACHABLE
    },
    cancelled: {
      value: orderStatus.CANCELLED
    },
    completed: {
      value: orderStatus.COMPLETED
    },
    deleted: {
      value: orderStatus.DELETED
    }
  }
})