const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'ListDirectionEnum',
  values: {
    asc: {
      value: 1
    },
    desc: {
      value: -1
    }
  }
})