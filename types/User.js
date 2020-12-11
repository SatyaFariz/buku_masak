const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} = require('graphql')

const { isEmail } = require('validator')

const userType = require('../constants/userType')

const DeliveryAddress = require('./DeliveryAddress')
const Image = require('./Image')
const isValidUsername = require('../utils/isValidUsername')

module.exports = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
      resolve: root => root.loginIds.find(id => isValidUsername(id))
    },
    email: {
      type: GraphQLString,
      resolve: root => root.loginIds.find(id => isEmail(id))
    },
    phone: {
      type: GraphQLString,
      resolve: root => root.loginIds.find(id => !isEmail(id) && !isValidUsername(id))
    },
    deliveryAddresses: {
      type: new GraphQLList(DeliveryAddress)
    },
    profilePhoto: {
      type: Image
    },
    accountType: {
      type: GraphQLString,
      resolve: root => {
        if(root.userType === userType.ADMIN)
          return 'admin'
        else if(root.userType === userType.COURIER)
          return 'courier'
        else
          return 'customer'
      }
    },
    lastActive: {
      type: GraphQLString,
      resolve: root => root.lastActive.toISOString()
    }
  }
})