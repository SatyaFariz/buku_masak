const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')
const UnitConversionInput = require('./UnitConversionInput')

module.exports = new GraphQLInputObjectType({
  name: 'ProductInput',
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
    published: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    inStock: {
      type: new GraphQLNonNull(GraphQLBoolean)
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