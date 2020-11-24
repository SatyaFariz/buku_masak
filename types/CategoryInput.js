const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'CategoryInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    type: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    code: {
      type: GraphQLString
    },
    published: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
  }
})