const {
  connectionDefinitions
} = require('graphql-relay')

const Notification = require('./Notification')

const { connectionType: NotificationConnection } = connectionDefinitions({ nodeType: Notification })

module.exports = NotificationConnection