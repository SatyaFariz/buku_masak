const mongoose = require('mongoose')
const { Schema } = mongoose

const screenParamSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

module.exports = screenParamSchema


