const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')
const isTodayBefore = require('../utils/isTodayBefore')

module.exports = new GraphQLObjectType({
  name: 'Discount',
  fields: () => ({

    pricePerUnitQty: {
      type: GraphQLFloat
    },
    orderQtyThreshold: {
      type: GraphQLInt
    },
    startDate: {
      type: GraphQLString,
      resolve: root => root.startDate.toISOString()
    },
    endDate: {
      type: GraphQLString,
      resolve: root => root.endDate.toISOString()
    },
    isInTheFuture: {
      type: GraphQLBoolean,
      resolve: ({ startDate }) => isTodayBefore(startDate)
    }
  })
})