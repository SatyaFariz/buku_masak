const {
  connectionDefinitions
} = require('graphql-relay')

const User = require('./User')

const { connectionType: UserConnection } = connectionDefinitions({ nodeType: User })

module.exports = UserConnection