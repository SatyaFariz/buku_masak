const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

const userStatus = require('../constants/userStatus')

module.exports = new GraphQLObjectType({
  name: 'UserStatus',
  fields: {
    display: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case userStatus.ACTIVE:
            return 'Active'
          case userStatus.INACTIVE:
            return 'Inactive'
          case userStatus.DEACTIVATED:
            return 'Deactivated'
        }
      }
    },
    code: { 
      type: GraphQLString,
      resolve: root => {
        switch(root) {
          case userStatus.ACTIVE:
            return 'active'
          case userStatus.INACTIVE:
            return 'inactive'
          case userStatus.DEACTIVATED:
            return 'deactivated'
        }
      }
    },
    value: {
      type: GraphQLInt,
      resolve: root => root
    },
  }
})