const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const RecipeModel = require('../database/models/Recipe')

module.exports = async ({ q, limit, after }) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }

  const query = {}

  if(after)
    query._id = { $lt: ObjectId(cursorToId(after)) }

  return await RecipeModel.find(query, null, options)
  
}