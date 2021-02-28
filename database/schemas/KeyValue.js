const mongoose = require('mongoose')
const { Schema } = mongoose

const keyValueSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})

module.exports = keyValueSchema


