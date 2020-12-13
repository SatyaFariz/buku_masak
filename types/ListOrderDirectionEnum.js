const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'ListOrderDirectionEnum',
  values: {
    asc: {
      value: 1
    },
    desc: {
      value: -1
    }
  }
})