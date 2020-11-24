const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')

const Coordinate = require('./Coordinate')

module.exports = new GraphQLObjectType({
  name: 'GooglePlace',
  fields: () => ({
    id: { 
      type: GraphQLString,
      resolve: root => root.place_id
    },

    name: {
      type: GraphQLString
    },

    formatedAddress: {
      type: GraphQLString,
      resolve: root => root.formated_address
    },

    types: {
      type: new GraphQLList(GraphQLString)
    },

    vicinity: {
      type: GraphQLString
    },

    location: {
      type: Coordinate,
      resolve: root => {
        const { geometry } = root
        return geometry && geometry.location
      }
    }
  }) 
})