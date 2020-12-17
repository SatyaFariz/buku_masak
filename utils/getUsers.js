const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const UserModel = require('../database/models/User')
const { isMongoId } = require('validator')

module.exports = async ({
  limit, 
  after,
  q,
  userType
}) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }
  
  const query = {}

  if(q && q.trim().length > 0) {
    if(isMongoId(q)) {
      query._id = ObjectId(q)
    } else {
      query['$text'] = { $search: q }
    }
  }

  if(typeof userType === 'number')
    query.userType = userType

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }
console.log(query)
  return await UserModel.find(query, null, options)
  
}