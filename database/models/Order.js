const mongoose = require('mongoose')
const imageSchema = require('../schemas/Image')
const { Schema, model } = mongoose

const deliveryAddressSchema = require('../schemas/DeliveryAddress')

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  lastUpdatedBy: {
    type: Schema.ObjectId,
    required: true,
  },
  courierId: {
    type: Schema.ObjectId,
  },
  status: {
    type: Number,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  packagingPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: new Schema({
      _id: {
        type: Schema.ObjectId,
        required: true,
      },
      display: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
    }),
    required: true
  },
  items: {
    type: [new Schema({
      orderQty: {
        type: Number,
        required: true
      },
      discountedOrderQty: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      },
      product: {
        type: new Schema({
          _id: {
            type: Schema.ObjectId,
            required: true,
          },
          name: {
            type: String,
            required: true
          },
          image: {
            type: imageSchema,
            required: true
          },
          pricePerUnitQty: {
            type: Number,
            required: true
          },
          unitQty: {
            type: Number,
            required: true
          },
          unit: {
            type: String,
            required: true,
          },
          discount: {
            type: new Schema({
              pricePerUnitQty: {
                type: Number,
                required: true
              },
              orderQtyThreshold: {
                type: Number
              }
            })
          }
        }),
        required: true
      },
    })],
    required: true
  }
}, { timestamps: true })

const Order = model('Order', orderSchema)

module.exports = Order