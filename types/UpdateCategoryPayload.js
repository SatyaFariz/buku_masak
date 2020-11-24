const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Category = require('./Category')

module.exports = new GraphQLObjectType({
  name: 'UpdateCategoryPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    category: {
      type: Category,
    },
  }
})