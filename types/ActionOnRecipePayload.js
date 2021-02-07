const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const { idToCursor } = require('../utils/relayCursor')

const ActionInfo = require('./ActionInfo')
const Recipe = require('./Recipe')

module.exports = new GraphQLObjectType({
  name: 'ActionOnRecipePayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    recipe: {
      type: Recipe,
    },
    cursor: {
      type: GraphQLString,
      resolve: root => root?.recipe?.id && idToCursor(root.recipe?.id)
    }
  }
})