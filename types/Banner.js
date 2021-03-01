const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList
} = require('graphql')

const Image = require('./Image')
const ScreenParam = require('./ScreenParam')

module.exports = new GraphQLObjectType({
  name: 'Banner',
  fields: () => ({
    id: { 
      type: GraphQLID
    },
    image: {
      type: Image
    },
    screen: {
      type: GraphQLString
    },
    screenParams: {
      type: new GraphQLList(ScreenParam)
    },
    activeDate: {
      type: GraphQLString,
      resolve: root => root.activeDate.toISOString()
    },
    expiryDate: {
      type: GraphQLString,
      resolve: root => root.expiryDate.toISOString()
    },
    published: {
      type: GraphQLBoolean
    }
  })
})