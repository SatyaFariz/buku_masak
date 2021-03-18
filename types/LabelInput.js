const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

const Color = require('./Color')

module.exports = new GraphQLInputObjectType({
  name: 'LabelInput',
  fields: {
    display: {
      type: new GraphQLNonNull(GraphQLString)
    },
    backgroundColor: {
      type: new GraphQLNonNull(Color)
    },
    categoryIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    forFilter: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }
})