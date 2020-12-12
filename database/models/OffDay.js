const mongoose = require('mongoose')
const { Schema, model } = mongoose

const offDaySchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
})

const OffDay = model('OffDay', offDaySchema)

module.exports = OffDay