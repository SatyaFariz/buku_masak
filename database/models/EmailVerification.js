const mongoose = require('mongoose')
const { Schema, model } = mongoose

const emailVerificationSchema = new Schema({
  _id: {
    type: String, // email here
    required: true
  },
  code: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true
  }
}, { timestamps: true })

const EmailVerification = model('EmailVerification', emailVerificationSchema)

module.exports = EmailVerification