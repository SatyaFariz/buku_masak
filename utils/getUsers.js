const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const UserModel = require('../database/models/User')
const moment = require('moment')

module.exports = async ({
  limit, 
  after,
}) => {
  const options = { 
    sort: { _id: direction || -1 }, 
    limit: limit 
  }

  const query = {}

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await UserModel.find(query, null, options)
  
}