const {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType
} = require('graphql')

const Product = require('./Product')

module.exports = new GraphQLObjectType({
  name: 'OrderItemSummary',
  fields: {
    id: { 
      type: GraphQLID,
      resolve: root => root._id
    },
    totalSaleAmount: {
      type: GraphQLFloat
    },
    totalOrderCount: {
      type: GraphQLInt
    },
    totalUnitQty: {
      type: GraphQLFloat
    },
    totalOrderQty: {
      type: GraphQLInt
    },
    product: {
      type: Product
    }
  }
})