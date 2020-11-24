const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType
} = require('graphql')

const Image = require('./Image')

module.exports = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
    },
    code: {
      type: GraphQLString
    },
    type: {
      type: GraphQLInt
    },
    published: {
      type: GraphQLBoolean
    },
    icon: {
      type: Image
    }
  }
})