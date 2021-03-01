const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql')

const { GraphQLDateTime } = require('graphql-custom-types')
const ScreenParamInput = require('./ScreenParamInput')

module.exports = new GraphQLInputObjectType({
  name: 'BannerInput',
  fields: {
    screen: {
      type: new GraphQLNonNull(GraphQLString)
    },
    screenParams: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ScreenParamInput))),
    },
    activeDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    },
    expiryDate: {
      type: GraphQLDateTime
    },
    published: {
      type: GraphQLBoolean
    }
  }
})