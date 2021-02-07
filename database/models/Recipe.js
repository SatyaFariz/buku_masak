const mongoose = require('mongoose')
const { Schema, model } = mongoose
const imageSchema = require('../schemas/Image')

const recipeSchema = new Schema({
  videoUrl: {
    type: String,
  },
  categoryIds: {
    type: [Schema.ObjectId],
    default: []
  },
  images: {
    type: [imageSchema],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  servings: {
    type: [Number],
    required: true
  },
  cookingTime: {
    type: String
  },
  desc: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
    required: true
  },
  ingredients: {
    type: [new Schema({
      name: {
        type: String,
        required: true
      },
      qty: {
        type: String,
      },
      productId: {
        type: Schema.ObjectId
      }
    })],
    required: true
  },
  steps: {
    type: [new Schema({
      desc: {
        type: String,
        required: true
      },
      images: {
        type: [imageSchema],
        default: []
      },
      videoUrl: {
        type: String
      }
    })]
  }
})

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe