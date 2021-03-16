const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'EntityTypeEnum',
  values: {
    product: {
      value: 'product'
    },
    recipe: {
      value: 'recipe'
    },
    collection: {
      value: 'collection'
    }
  }
})