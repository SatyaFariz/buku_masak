const {
  GraphQLString,
  GraphQLObjectType,
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'ScreenParam',
  fields: {
    key: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    }
  }
})