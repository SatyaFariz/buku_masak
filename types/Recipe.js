const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const Image = require('./Image')

module.exports = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
    id: { 
      type: GraphQLID
    },
    url: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    desc: {
      type: GraphQLString,
    },
    images: {
      type: new GraphQLList(Image)
    }
  }
})