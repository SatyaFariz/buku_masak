const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

const userType = require('../constants/userType')

module.exports = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    display: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case userType.ADMIN:
            return 'Admin'
          case userType.COURIER:
            return 'Courier'
          case userType.CUSTOMER:
            return 'Customer'
        }
      }
    },
    code: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case userType.Admin:
            return 'admin'
          case userType.COURIER:
            return 'courier'
          case userType.CUSTOMER:
            return 'customer'
        }
      }
    },
    value: {
      type: GraphQLInt,
      resolve: root => root
    },
  }
})