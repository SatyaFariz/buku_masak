const {
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

const { GraphQLDateTime } = require('graphql-custom-types')

module.exports = new GraphQLInputObjectType({
  name: 'DateRangeInput',
  fields: {
    startDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    },
    endDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    },
  }
})