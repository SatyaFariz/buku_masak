const {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'EmailVerification',
  fields: {
    email: { 
      type: GraphQLString
    },
    expires: {
      type: GraphQLInt,
      resolve: root => root.expires.getTime() - new Date().getTime()
    },
  }
})