const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'PlatformEnum',
  values: {
    web: {
      value: 0
    },
    android: {
      value: 1
    },
    ios: {
      value: 2
    }
  }
})