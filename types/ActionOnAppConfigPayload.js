const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const AppConfig = require('./AppConfig')

module.exports = new GraphQLObjectType({
  name: 'ActionOnAppConfig',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    appConfig: {
      type: AppConfig,
    },
  }
})