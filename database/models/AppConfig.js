const mongoose = require('mongoose')
const { Schema, model } = mongoose

const appConfigSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  offDaysOfTheWeek: {
    type: [Number],
    required: true,
    default: []
  },
  deliveryDaysThreshold: {
    type: Number,
    required: true,
  },
  whatsappNumbers: {
    type: [String],
    required: true,
    default: []
  },
  instagramUrls: {
    type: [String],
    required: true,
    default: []
  },
  facebookUrls: {
    type: [String],
    required: true,
    default: []
  },
  playStoreUrl: {
    type: String,
    required: true,
  },
  aboutUsUrl: {
    type: String,
    required: true,
  },
  faqUrl: {
    type: String,
    required: true,
  },
  privacyPolicyUrl: {
    type: String,
    required: true,
  },
  termsOfServiceUrl: {
    type: String,
    required: true,
  },
  feedbackUrl: {
    type: String,
    required: true,
  },
  packagingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethods: {
    type: [new Schema({
      display: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      published: {
        type: Boolean,
        required: true,
        default: false
      },
      default: {
        type: Boolean,
        required: true,
        default: false
      }
    })]
  }
}, { timestamps: true })

const AppConfig = model('AppConfig', appConfigSchema)

module.exports = AppConfig