const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const ProductModel = require('../database/models/Product')

module.exports = async ({ q, limit, after, categoryId, published }) => {
  const options = { 
    sort: { _id: -1 }, 
    limit: limit 
  }

  if(q.trim().length === 0) {
    const query = {}
    if(after)
      query._id = { $lt: ObjectId(cursorToId(after)) }

    if(categoryId)
      query.categoryIds = ObjectId(categoryId)

    if(published)
      query.published = published

    return await ProductModel.find(query, null, options)
  } else {
    const query = {
      $text: { $search: q }
    }

    if(after)
      query._id = { $lt: ObjectId(cursorToId(after)) }

    if(categoryId)
      query.categoryIds = ObjectId(categoryId)

    if(published)
      query.published = published
      
    return ProductModel.find(query, null, options)
  }
}