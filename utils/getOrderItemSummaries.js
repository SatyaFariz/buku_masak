const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')

module.exports = async () => {
  const match = {}

  const project = {
    productId: '$items.product._id',
    unit: '$items.product.unit',
    productId_unit: { $concat: [{ $toString: '$items.product._id' }, '_', '$items.product.unit']},
    orderQty: '$items.orderQty',
    unitQty: '$items.product.unitQty',
    totalPrice: '$totalPrice'
  }

  const group = {
    _id: '$productId_unit',
    count: { $sum: 1 },
    totalUnitQty: { $sum: { $multiply: ['$orderQty', '$unitQty'] }},
    totalOrderQty: { $sum: '$orderQty' },
    totalSaleAmount: { $sum: '$totalPrice' }
  }
      
  const result = await OrderModel.aggregate([
    
    { '$match': match },
    { '$unwind': '$items' },
    { '$project': project },
    { '$group': group },    
  ])

  console.log(result)
}