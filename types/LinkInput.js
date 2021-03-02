const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql')

const ScreenParamInput = require('./ScreenParamInput')

module.exports = new GraphQLInputObjectType({
  name: 'LinkInput',
  fields: {
    label: {
      type: new GraphQLNonNull(GraphQLString)
    },
    screen: {
      type: new GraphQLNonNull(GraphQLString)
    },
    screenParams: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ScreenParamInput))),
    },
    published: {
      type: GraphQLBoolean
    }
  }
})