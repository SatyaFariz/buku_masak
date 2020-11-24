const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'UnitConversionInput',
  fields: {
    lowerValue: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    upperValue: {
      type: GraphQLFloat
    },
    targetUnitId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    targetUnitLowerValue: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    targetUnitUpperValue: {
      type: GraphQLFloat
    },
  }
})