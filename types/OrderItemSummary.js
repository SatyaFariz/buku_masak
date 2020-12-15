const {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType
} = require('graphql')

const Product = require('./Product')
const ProductLoader = require('../dataloader/ProductLoader')
const mongoose = require('mongoose')

module.exports = new GraphQLObjectType({
  name: 'OrderItemSummary',
  fields: {
    id: { 
      type: GraphQLID,
      resolve: root => root._id
    },
    totalSaleAmount: {
      type: GraphQLFloat
    },
    totalOrderCount: {
      type: GraphQLInt
    },
    totalUnitQty: {
      type: GraphQLFloat
    },
    totalOrderQty: {
      type: GraphQLInt
    },
    unit: {
      type: GraphQLString,
      resolve: root => root._id.split('_')[1]
    },
    product: {
      type: Product,
      resolve: async root => {
        const [productId] = root._id.split('_')
        return await ProductLoader.load(mongoose.Types.ObjectId(productId))
      }
    }
  }
})