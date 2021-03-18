const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const Label = require('./Label')

module.exports = new GraphQLObjectType({
  name: 'ActionOnLabelPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    label: {
      type: Label,
    },
  }
})