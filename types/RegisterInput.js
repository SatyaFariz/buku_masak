const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'RegisterInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: { 
      type: new GraphQLNonNull(GraphQLString)
    },
    loginId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
  }
})