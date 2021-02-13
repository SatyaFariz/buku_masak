const mongoose = require('mongoose')
const { Schema, model } = mongoose
const imageSchema = require('../schemas/Image')

const recipeSchema = new Schema({
  videoUrl: {
    type: String,
    trim: true
  },
  categoryIds: {
    type: [Schema.ObjectId],
    default: []
  },
  lastUpdatedBy: {
    type: Schema.ObjectId,
    required: true
  },
  images: {
    type: [imageSchema],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  serving: {
    type: String,
    required: true,
    trim: true
  },
  cookingTime: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    trim: true
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
        required: true,
        trim: true
      },
      qty: {
        type: String,
        trim: true
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
        required: true,
        trim: true
      },
      images: {
        type: [imageSchema],
        default: []
      },
      videoUrl: {
        type: String,
        trim: true
      }
    })]
  }
})

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe