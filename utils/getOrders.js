const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const moment = require('moment')

module.exports = async ({ 
  dateRange, 
  status,
  limit, 
  after,
  statusIn,
  statusNotIn
}) => {
  const options = { 
    sort: { _id: -1 }, 
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

  if(statusIn?.length > 0)
    query.status = { $in: statusIn }

  if(statusNotIn?.length > 0)
    query.status = { $nin: statusNotIn }

  if(status !== null && status !== undefined)
    query.status = { $in: [status] }

  return await OrderModel.find(query, null, options)
  
}