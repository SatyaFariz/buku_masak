const getGoogleMapsSession = require('./getGoogleMapsSession')
const googleMaps = require('../lib/googleMaps')

module.exports = (query, ctx) => {
  if(query.trim() === '')
    return []
    
  return new Promise((resolve, reject) => {
    const sessiontoken = getGoogleMapsSession(ctx)
    googleMaps.placesAutoComplete({
      sessiontoken,
      input: query,
      location: {
        lat: 0.7893,
        lng: 113.9213
      }
    }, (err, res) => {
        if(err) {
          reject(err)
        } else {
          resolve(res.json.predictions)
        }
    })
  })
}