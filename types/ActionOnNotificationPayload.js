const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const { idToCursor } = require('../utils/relayCursor')

const ActionInfo = require('./ActionInfo')
const Notification = require('./Notification')

module.exports = new GraphQLObjectType({
  name: 'ActionOnNotificationPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    notification: {
      type: Notification,
    },
    cursor: {
      type: GraphQLString,
      resolve: root => root?.notification?.id && idToCursor(root.notification?.id)
    }
  }
})