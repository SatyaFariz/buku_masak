const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const orderStatus = require('../constants/orderStatus')

module.exports = async ({ userId, limit, after }) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }


  const query = { userId, status: { $ne: orderStatus.DELETED }}
  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await OrderModel.find(query, null, options)
  
}