const {
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const BigInt = require('graphql-bigint')
const CartItem = require('./CartItem')

module.exports = new GraphQLObjectType({
  name: 'Cart',
  fields: {
    updatedAt: { 
      type: BigInt,
      resolve: root => root.updatedAt.getTime()
    },
    items: {
      type: new GraphQLList(CartItem),
    },
  }
})