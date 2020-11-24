const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Image',
  fields: {
    id: { 
      type: GraphQLID
    },
    url: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLFloat
    },
    width: {
      type: GraphQLFloat,
    },
    aspectRatio: {
      type: GraphQLFloat,
      resolve: root => root.height / root.width
    },
    bytes: {
      type: GraphQLFloat
    },
    format: {
      type: GraphQLString
    },
    display: {
      type: GraphQLInt
    }
  }
})