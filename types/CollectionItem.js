const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLUnionType,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Recipe = require('./Recipe')
const Product = require('./Product')
const ProductModel = require('../database/models/Product')

module.exports = new GraphQLUnionType({
  name: 'CollectionItem',
  types: [Recipe, Product],
  resolveType(value) {
    console.log('VALUE', value)
    if (value instanceof ProductModel) {
      return Product
    }
    if (/*value instanceof Recipe*/false) {
      return Recipe
    }
  }
})