const mongoose = require('mongoose')
const { Schema, model } = mongoose
const imageSchema = require('../schemas/Image')

const recipeSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  categoryIds: {
    type: [Schema.ObjectId]
  },
  images: {
    type: [imageSchema],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
    required: true
  },
})

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe