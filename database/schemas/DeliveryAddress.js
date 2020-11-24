const mongoose = require('mongoose')
const { Schema } = mongoose

const deliveryAddressSchema = new Schema({
  address: String,
  lng: Number,
  lat: Number,
  default: Boolean
})

module.exports = deliveryAddressSchema


