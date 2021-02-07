const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Ingredient',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
    },
    qty: {
      type: GraphQLString
    },
    productId: {
      type: GraphQLString
    }
  }
})