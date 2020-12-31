const {
  GraphQLString,
  GraphQLObjectType,
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'KeyValue',
  fields: {
    key: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    }
  }
})