const {
  connectionDefinitions
} = require('graphql-relay')

const Order = require('./Order')

const { connectionType: OrderConnection } = connectionDefinitions({ nodeType: Order })

module.exports = OrderConnection