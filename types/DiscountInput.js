const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require('graphql')

const { GraphQLDateTime } = require('graphql-custom-types')

module.exports = new GraphQLInputObjectType({
  name: 'DiscountInput',
  fields: {
    pricePerUnitQty: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    orderQtyThreshold: {
      type: GraphQLInt,
    },
    startDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    },
    endDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    },
  }
})