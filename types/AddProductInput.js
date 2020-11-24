const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')
const UnitConversionInput = require('./UnitConversionInput')

module.exports = new GraphQLInputObjectType({
  name: 'AddProductInput',
  fields: {
    categoryIds: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      )
    },
    name: { 
      type: new GraphQLNonNull(GraphQLString)
    },
    desc: {
      type: new GraphQLNonNull(GraphQLString),
    },
    healthBenefits: {
      type: GraphQLString
    },
    prepAndStorage: {
      type: GraphQLString,
    },
    pricePerUnitQty: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    unitQty: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    unitId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    unitConversion: {
      type: UnitConversionInput
    },
    maxOrder: {
      type: GraphQLInt
    },
  }
})