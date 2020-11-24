const {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType
} = require('graphql')

const Product = require('./Product')
const ProductLoader = require('../dataloader/ProductLoader')

module.exports = new GraphQLObjectType({
  name: 'CartItem',
  fields: {
    id: { 
      type: GraphQLID
    },
    product: {
      type: Product,
      resolve: async (root) => await ProductLoader.load(root.productId)
    },
    qty: {
      type: GraphQLInt,
    }
  }
})