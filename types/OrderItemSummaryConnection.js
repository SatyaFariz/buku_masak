const {
  connectionDefinitions
} = require('graphql-relay')

const OrderItemSummary = require('./OrderItemSummary')

const { connectionType: OrderItemSummaryConnection } = connectionDefinitions({ nodeType: OrderItemSummary })

module.exports = OrderItemSummaryConnection