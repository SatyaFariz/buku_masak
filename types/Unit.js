const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Unit',
  fields: {
    id: { 
      type: GraphQLID
    },
    display: {
      type: GraphQLString,
    },
  }
})