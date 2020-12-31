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
const KeyValue = require('./KeyValue')

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
      type: new GraphQLList(KeyValue)
    },
    images: {
      type: new GraphQLList(Image)
    }
  }
})