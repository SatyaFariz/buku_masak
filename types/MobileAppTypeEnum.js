const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'MobileAppTypeEnum',
  values: {
    admin: {
      value: 0
    },
    main: {
      value: 1
    }
  }
})