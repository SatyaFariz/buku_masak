const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'CollectionInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    desc: {
      type: GraphQLString
    },
    linkedRecipeId: {
      type: GraphQLString
    },
    published: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
  }
})