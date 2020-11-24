const DataLoader = require('dataloader')
const mysql = require('mysql')
const mysqlConnection = require('../database/mysql')
const { LRUMap } = require('lru_map')

module.exports = new DataLoader(latLngs => {
  return new Promise((resolve, reject) => {
    
    if(latLngs.length > 1) {
      resolve(latLngs.map(() => []))
    } else {
      const [lat, lng] = latLngs[0].split(',')
      const sql = mysql.format('CALL get_service_availability(?, ?)', [lat, lng])

      mysqlConnection.query(sql, function (error, results, fields) {
        const data = results[0][0]
        resolve([data])
      })
    }

  })
}, { cacheMap: new LRUMap(1000) })