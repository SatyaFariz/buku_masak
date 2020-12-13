const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const moment = require('moment')

module.exports = async ({ 
  startDate,
  endDate,
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

  if(startDate || endDate) {
    const deliveryDate = {}
    if(startDate) {
      const start = moment(startDate).startOf('day')
      deliveryDate['$gte'] = start
    }
    
    if(endDate) {
      const end = moment(endDate).endOf('day')
      deliveryDate['$lt'] = end
    }
    
    query.deliveryDate = deliveryDate
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