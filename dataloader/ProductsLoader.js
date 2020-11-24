const ProductModel = require('../database/models/Product')
const Dataloader = require('dataloader')
const { LRUMap } = require('lru_map')

module.exports = new Dataloader(arrayOfIds => {
  const ids = arrayOfIds.flat()
  const query = {
    _id: {
      $in: ids
    }
  }

  return ProductModel.find(query).then(docs => {
    return arrayOfIds.map(ids => docs.filter(doc => ids.some(id => id.equals(doc._id))))
  })
  
}, { cacheMap: new LRUMap(100) })