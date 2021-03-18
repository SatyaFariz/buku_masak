const mongoose = require('mongoose')
const { Schema, model } = mongoose

const labelSchema = new Schema({
  display: {
    type: String,
    required: true,
    unique: true
  },
  categoryIds: {
    type: [Schema.ObjectId],
    required: true,
    default: []
  },
  forFilter: {
    type: Boolean,
    required: true,
    default: true
  },
  backgroundColor: {
    type: String,
    required: true
  },
})

const Label = model('Label', labelSchema)

module.exports = Label