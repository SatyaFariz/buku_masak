const mongoose = require('mongoose')
const { Schema, model } = mongoose

const imageSchema = require('../schemas/Image')

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  productIds: {
    type: [Schema.ObjectId],
    required: true,
    default: []
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  image: {
    type: imageSchema,
  }
})

const Collection = model('Collection', collectionSchema)

module.exports = Collection