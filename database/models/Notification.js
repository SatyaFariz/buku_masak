const mongoose = require('mongoose')
const { Schema, model } = mongoose

const imageSchema = require('../schemas/Image')
const ScreenParam = require('../schemas/ScreenParam')

const notificationSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    trim: true,
    required: true
  },
  from: {
    type: Schema.ObjectId,
  },
  to: {
    type: [Schema.ObjectId],
    required: true
  },
  readBy: {
    type: [Schema.ObjectId],
    required: true,
    default: []
  },
  screen: {
    type: String,
    required: true,
    enum: ['ProductDetail', 'OrderDetail']
  },
  screenParams: {
    type: [ScreenParam],
    required: true,
    default: []
  },
  images: {
    type: [imageSchema],
    required: true,
    default: []
  }
}, { timestamps: true })

const Notification = model('Notification', notificationSchema)

module.exports = Notification