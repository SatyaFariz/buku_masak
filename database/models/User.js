const mongoose = require('mongoose')
const imageSchema = require('../schemas/Image')
const { Schema, model } = mongoose

const userType = require('../../constants/userType')
const deliveryAddressSchema = require('../schemas/DeliveryAddress')

const userSchema = new Schema({
  name:  {
    type: String,
    required: true,
    trim: true
  },
  loginIds: {
    type: [String],
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: Number,
    required: true,
    enum: [userType.ADMIN, userType.CUSTOMER]
  },
  coins: {
    type: Number,
    required: true,
    default: 0
  },
  lastActive: {
    type: Date,
    required: true,
    default: Date.now
  },
  profilePhoto: imageSchema,
  lastLogin: Date,
  deliveryAddresses: {
    type: [deliveryAddressSchema],
    default: []
  }
}, { timestamps: true })

const User = model('User', userSchema)

module.exports = User