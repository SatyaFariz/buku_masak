const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} = require('graphql')

const Image = require('./Image')
const ScreenParam = require('./ScreenParam')

module.exports = new GraphQLObjectType({
  name: 'Notification',
  fields: {
    id: { 
      type: GraphQLID
    },
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
    screen: {
      type: GraphQLString
    },
    screenParams: {
      type: new GraphQLList(ScreenParam)
    },
    images: {
      type: new GraphQLList(Image)
    },
    createdAt: {
      type: GraphQLString,
      resolve: root => root.createdAt.toISOString()
    }
  }
})