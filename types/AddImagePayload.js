const {
  GraphQLUnionType,
} = require('graphql')

const ActionOnProductPayload = require('./ActionOnProductPayload')
const ActionOnRecipePayload = require('./ActionOnRecipePayload')
const ActionOnCollectionPayload = require('./ActionOnCollectionPayload')

module.exports = new GraphQLUnionType({
  name: 'AddImagePayload',
  types: [ActionOnProductPayload, ActionOnRecipePayload],
  resolveType(value) {
    if (value.entityType === 'recipe') {
      return ActionOnRecipePayload
    }
    if (value.entityType === 'product') {
      return ActionOnProductPayload
    }
    if (value.entityType === 'collection') {
      return ActionOnCollectionPayload
    }
  }
})