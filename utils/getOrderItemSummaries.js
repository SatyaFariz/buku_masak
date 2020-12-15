const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { cursorToId } = require('./relayCursor')
const OrderModel = require('../database/models/Order')
const moment = require('moment')

module.exports = async ({
  startDate,
  endDate
}) => {
  const match = {
  }

  if(startDate || endDate) {
    const deliveryDate = {}
    if(startDate) {
      const start = moment(startDate).startOf('day').toDate()
      deliveryDate['$gte'] = start
    }
    
    if(endDate) {
      const end = moment(endDate).endOf('day').toDate()
      deliveryDate['$lt'] = end
    }
    
    match.deliveryDate = deliveryDate
  }

  const project = {
    productId: '$items.product._id',
    unit: '$items.product.unit',
    productId_unit: { $concat: [{ $toString: '$items.product._id' }, '_', '$items.product.unit']},
    orderQty: '$items.orderQty',
    unitQty: '$items.product.unitQty',
    totalPrice: '$totalPrice',
    deliveryDate: '$deliveryDate'
  }

  const group = {
    _id: '$productId_unit',
    totalOrderCount: { $sum: 1 },
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

  return result
}