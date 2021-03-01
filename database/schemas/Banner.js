const mongoose = require('mongoose')
const { Schema } = mongoose

const Image = require('./Image')
const KeyValue = require('./KeyValue')

const bannerSchema = new Schema({
  image: {
    type: Image,
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  screenParams: {
    type: [KeyValue],
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
})

module.exports = bannerSchema


