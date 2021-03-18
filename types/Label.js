const {
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Label',
  fields: {
    id: {
      type: GraphQLID
    },
    display: {
      type: GraphQLString,
    },
    backgroundColor: {
      type: GraphQLString,
    },
    forFilter: {
      type: GraphQLBoolean,
    },
    categoryIds: {
      type: new GraphQLList(GraphQLString)
    }
  }
})