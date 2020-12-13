const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const moment = require('moment')

module.exports = async ({ 
  dateRange,
  limit, 
  after,
  statusIn,
  statusNotIn,
  direction
}) => {
  const options = { 
    sort: { _id: direction || -1 }, 
    limit: limit 
  }

  const query = {}

  if(dateRange) {
    const start = moment(dateRange.startDate).startOf('day')
    const end = moment(dateRange.endDate).endOf('day')

    query.deliveryDate = { $gte: start, $lt: end }
  }

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  if(statusIn?.length > 0 || statusNotIn?.length > 0) {
    const status = {}
    if(statusIn?.length > 0)
      status['$in'] = statusIn

    if(statusNotIn?.length > 0)
      status['$nin'] = statusNotIn

    query.status = status
  }

  return await OrderModel.find(query, null, options)
  
}