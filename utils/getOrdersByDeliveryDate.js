const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const moment = require('moment')

module.exports = async ({ date, limit, after }) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }

  const start = moment(date).startOf('day')
  const end = moment(date).endOf('day')

  const query = { deliveryDate: { $gte: start, $lt: end }}

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await OrderModel.find(query, null, options)
  
}