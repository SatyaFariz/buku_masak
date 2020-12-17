const {
  GraphQLEnumType,
} = require('graphql')

const userType = require('../constants/userType')

module.exports = new GraphQLEnumType({
  name: 'UserTypeEnum',
  values: {
    admin: {
      value: userType.ADMIN
    },
    customer: {
      value: userType.CUSTOMER
    },
    courier: {
      value: userType.COURIER
    }
  }
})