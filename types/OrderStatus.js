const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

const orderStatus = require('../constants/orderStatus')

module.exports = new GraphQLObjectType({
  name: 'OrderStatus',
  fields: {
    display: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case orderStatus.PROCESSING:
            return 'Processing'
          case orderStatus.COMPLETED:
            return 'Completed'
          case orderStatus.CANCELLED:
            return 'Cancelled'
          case orderStatus.UNREACHABLE:
            return 'Unreachable'
        }
      }
    },
    code: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case orderStatus.PROCESSING:
            return 'processing'
          case orderStatus.COMPLETED:
            return 'completed'
          case orderStatus.CANCELLED:
            return 'cancelled'
          case orderStatus.UNREACHABLE:
            return 'unreachable'
        }
      }
    },
    value: {
      type: GraphQLInt,
      resolve: root => root
    },
  }
})