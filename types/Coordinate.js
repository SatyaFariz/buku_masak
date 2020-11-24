const {
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Coordinate',
  fields: {
    lat: { 
      type: GraphQLFloat
    },
    lng: {
      type: GraphQLFloat,
    },
  }
})