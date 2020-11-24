const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'GooglePlaceSearchPrediction',
  fields: () => ({    
    id: {
      type: GraphQLString,
      resolve: root => root.place_id
    },
    
    types: {
      type: new GraphQLList(GraphQLString)
    },

    description: {
      type: GraphQLString
    }
  }) 
})