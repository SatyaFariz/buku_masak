const mongoose = require('mongoose')
const { Schema, model } = mongoose

const collectionSchema = new Schema({
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
    enum: ['ProductDetails', 'OrderDetails']
  },
  screenParams: {
    type: [new Schema({
      key: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }, { _id: false })],
    required: true,
    default: []
  },
})

const Collection = model('Collection', collectionSchema)

module.exports = Collection