const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'CollectionTypeEnum',
  values: {
    product: {
      value: 'product'
    },
    recipe: {
      value: 'recipe'
    }
  }
})