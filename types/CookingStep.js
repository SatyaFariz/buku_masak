const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const Image = require('./Image')

module.exports = new GraphQLObjectType({
  name: 'CookingStep',
  fields: {
    id: { 
      type: GraphQLID
    },
    desc: {
      type: GraphQLString,
    },
    images: {
      type: new GraphQLList(Image)
    },
    videoUrl: {
      type: GraphQLString
    }
  }
})