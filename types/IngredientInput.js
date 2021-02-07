const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'IngredientInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    qty: { 
      type: GraphQLString
    },
    productId: {
      type: GraphQLString,
    }
  }
})