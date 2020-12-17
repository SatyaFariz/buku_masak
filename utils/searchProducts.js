const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const ProductModel = require('../database/models/Product')
const { isMongoId } = require('validator')

module.exports = async ({ q, limit, after, categoryId, published, inStock }) => {
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

    if(typeof published === 'boolean')
      query.published = published

    if(typeof inStock === 'boolean')
      query.inStock = inStock

    return await ProductModel.find(query, null, options)
  } else {
    const query = {
    }

    if(isMongoId(q)) {
      query._id = ObjectId(q)
    } else {
      query['$text'] = { $search: q }
    }

    if(after)
      query._id = { $lt: ObjectId(cursorToId(after)) }

    if(categoryId)
      query.categoryIds = ObjectId(categoryId)

    if(typeof published === 'boolean')
      query.published = published

    if(typeof inStock === 'boolean')
      query.inStock = inStock
      
    return ProductModel.find(query, null, options)
  }
}