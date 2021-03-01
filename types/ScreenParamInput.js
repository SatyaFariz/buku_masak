const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

const DataTypeEnum = require('./DataTypeEnum')

module.exports = new GraphQLInputObjectType({
  name: 'ScreenParamInput',
  fields: {
    key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value: {
      type: new GraphQLNonNull(GraphQLString)
    },
    type: {
      type: new GraphQLNonNull(DataTypeEnum)
    }
  }
})