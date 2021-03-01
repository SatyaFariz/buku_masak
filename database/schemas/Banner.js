const mongoose = require('mongoose')
const { Schema } = mongoose

const Image = require('./Image')
const ScreenParam = require('./ScreenParam')

const bannerSchema = new Schema({
  lastUpdatedBy: {
    type: Schema.ObjectId,
    required: true,
  },
  image: {
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
  activeDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  published: {
    type: Boolean,
    required: false,
    default: false
  }
}, { timestamps: true })

module.exports = bannerSchema


