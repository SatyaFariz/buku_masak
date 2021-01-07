const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const NotificationModel = require('../database/models/Notification')

module.exports = async ({ userId, limit, after }) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }

  const query = { to: userId }

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await NotificationModel.find(query, null, options)
  
}