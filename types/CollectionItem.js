const {
  GraphQLUnionType,
} = require('graphql')

const Recipe = require('./Recipe')
const Product = require('./Product')
const ProductModel = require('../database/models/Product')
const RecipeModel = require('../database/models/Recipe')

module.exports = new GraphQLUnionType({
  name: 'CollectionItem',
  types: [Recipe, Product],
  resolveType(value) {
    if (value instanceof ProductModel) {
      return Product
    }
    if (value instanceof RecipeModel) {
      return Recipe
    }
  }
})