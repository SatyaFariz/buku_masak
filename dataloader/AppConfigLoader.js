const AppConfigModel = require('../database/models/AppConfig')
const Dataloader = require('dataloader')
const { LRUMap } = require('lru_map')

module.exports = new Dataloader(ids => {

  const query = {
    _id: {
      $in: ids
    }
  }

  return AppConfigModel.find(query).then(docs => {
    return ids.map(id => docs.find(doc => doc._id === id))
  })
  
}, { cacheMap: new LRUMap(100) })