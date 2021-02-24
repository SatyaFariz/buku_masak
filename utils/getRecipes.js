const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const RecipeModel = require('../database/models/Recipe')
const { isMongoId } = require('validator')

module.exports = async ({ 
  q, 
  published,
  limit, 
  after 
}) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }

  const query = {}

  if(typeof published === 'boolean')
    query.published = published

  if(q?.trim().length > 0) {
    if(isMongoId(q.trim())) {
      query._id = ObjectId(q)
    } else {
      query['$text'] = { $search: q }
    }
  }

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await RecipeModel.find(query, null, options)
  
}