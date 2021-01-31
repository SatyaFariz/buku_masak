const {
  connectionDefinitions
} = require('graphql-relay')

const Recipe = require('./Recipe')

const { connectionType: RecipeConnection } = connectionDefinitions({ nodeType: Recipe })

module.exports = RecipeConnection