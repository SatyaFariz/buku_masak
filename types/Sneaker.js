const {
  GraphQLInt,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Sneaker',
  fields: {
    id: { 
      type: GraphQLID
    },
    idPrefix: {
      type: GraphQLString,
      resolve: () => 'sneakers_'
    },
    sneakerId: {
      type: GraphQLInt
    },
    name: { 
      type: GraphQLString 
    },
  }
})