const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Collection = require('./Collection')

module.exports = new GraphQLObjectType({
  name: 'ActionOnCollectionPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    collection: {
      type: Collection,
    },
  }
})