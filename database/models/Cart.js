const mongoose = require('mongoose')
const { Schema, model } = mongoose

const cartSchema = new Schema({
  cartId: {
    type: Schema.ObjectId,
    required: true,
    unique: true
  },
  items: [new Schema({
    productId: {
      type:Schema.ObjectId,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
  })],
}, { timestamps: true })

const Cart = model('Cart', cartSchema)

module.exports = Cart