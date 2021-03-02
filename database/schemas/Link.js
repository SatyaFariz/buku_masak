const mongoose = require('mongoose')
const { Schema } = mongoose

const Image = require('./Image')
const ScreenParam = require('./ScreenParam')

const linkSchema = new Schema({
  lastUpdatedBy: {
    type: Schema.ObjectId,
    required: true,
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: Image,
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  screenParams: {
    type: [ScreenParam],
    required: true,
    default: []
  },
  published: {
    type: Boolean,
    required: false,
    default: false
  }
}, { timestamps: true })

module.exports = linkSchema


