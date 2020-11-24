const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} = require('graphql')

const OrderProduct = require('./OrderProduct')

module.exports = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    id: { 
      type: GraphQLID
    },
    orderQty: {
      type: GraphQLInt,
    },
    discountedOrderQty: {
      type: GraphQLFloat,
    },
    subtotal: {
      type: GraphQLFloat
    },
    product: {
      type: OrderProduct
    }
  }
})