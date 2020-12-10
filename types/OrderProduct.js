const {
  GraphQLFloat,
  GraphQLString,
  GraphQLObjectType,
} = require('graphql')

const Image = require('./Image')
const Discount = require('./Discount')

module.exports = new GraphQLObjectType({
  name: 'OrderProduct',
  fields: {
    // don't use "id" property here, 
    // because if something changes in relay store (for example if we edit a product with same "id")
    // it will also change the "order" product details
    // we don't want that and any changes made to the product itself should not affect the "order" product details
    productId: { 
      type: GraphQLString,
      resolve: root => root._id
    },
    name: {
      type: GraphQLString,
    },
    pricePerUnitQty: {
      type: GraphQLFloat,
    },
    unitQty: {
      type: GraphQLFloat
    },
    unit: {
      type: GraphQLString
    },
    image: {
      type: Image
    },
    discount: {
      type: Discount
    }
  }
})