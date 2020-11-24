const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')

const Coordinate = require('./Coordinate')

module.exports = new GraphQLObjectType({
  name: 'Direction',
  fields: () => ({

    polylineCoordinates: {
      type: new GraphQLList(Coordinate)
    },
    destination: {
      type: Coordinate
    },
    summary: {
      type: GraphQLString
    }
  })
})