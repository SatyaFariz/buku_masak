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
  name: 'Link',
  fields: () => ({
    id: { 
      type: GraphQLID
    },
    icon: {
      type: Image
    },
    label: {
      type: GraphQLString
    },
    screen: {
      type: GraphQLString
    },
    screenParams: {
      type: new GraphQLList(ScreenParam)
    },
    published: {
      type: GraphQLBoolean
    }
  })
})