const mongoose = require('mongoose')
const imageSchema = require('../schemas/Image')
const { Schema, model } = mongoose
const discountSchema = require('../schemas/Discount')

const productSchema = new Schema({
  name:  {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  healthBenefits: {
    type: String,
    trim: true
  },
  prepAndStorage: {
    type: String,
    trim: true
  },
  featuredRecipeIds: {
    type: [Schema.ObjectId],
    required: true,
    default: []
  },
  images: [imageSchema],
  categoryIds: [Schema.ObjectId],
  includedProductIds: [Schema.ObjectId],
  linkedProductIds: [Schema.ObjectId],
  // we sell the products per unit quantity
  // for example per 250 gr or per 100 ounce
  pricePerUnitQty: Number,
  unitQty: Number,
  unitId: Schema.ObjectId,
  // approximate unit conversion. 
  // ex: 10 - 110 gr/pack or 5 - 6 pcs/0.9 - 1.1 kg
  unitConversion: new Schema({
    lowerValue: Number,
    upperValue: Number,
    targetUnitId: Schema.ObjectId,
    targetUnitLowerValue: Number,
    targetUnitUpperValue: Number
  }),
  discount: {
    type: discountSchema
  },
  maxOrder: Number,
  published: {
    type: Boolean,
    default: false,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true,
    required: true
  },
  lastUpdatedBy: {
    type: Schema.ObjectId,
    required: true
  },
})

const Product = model('Product', productSchema)

module.exports = Product