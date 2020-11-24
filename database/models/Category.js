const mongoose = require('mongoose')
const { Schema, model } = mongoose

const imageSchema = require('../schemas/Image')

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true,
    enum: [0, 1]
  },
  code: {
    type: String
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  icon: {
    type: imageSchema,
    required: true
  }
})

const Category = model('Category', categorySchema)

module.exports = Category