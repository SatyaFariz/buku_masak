const mongoose = require('mongoose')
const { Schema } = mongoose

const discountSchema = new Schema({
  pricePerUnitQty: {
    type: Number,
    required: true
  },
  orderQtyThreshold: {
    type: Number,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
})

module.exports = discountSchema


