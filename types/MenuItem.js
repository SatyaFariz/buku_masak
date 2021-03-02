const {
  GraphQLUnionType,
} = require('graphql')

const Link = require('./Link')
const Category = require('./Category')
const CategoryModel = require('../database/models/Category')

module.exports = new GraphQLUnionType({
  name: 'MenuItem',
  types: [Link, Category],
  resolveType(value) {
    if (value instanceof CategoryModel) {
      return Category
    }
    else {
      return Link
    }
  }
})