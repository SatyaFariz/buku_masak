const getGoogleMapsSession = require('./getGoogleMapsSession')
const googleMaps = require('../lib/googleMaps')

module.exports = (placeID, ctx) => {
  const sessiontoken = getGoogleMapsSession(ctx, { new: true })
  return new Promise((resolve, reject) => {
    googleMaps.place({
      sessiontoken,
      placeid: placeID
    }, (err, res) => {
      const { json } = res
      if(err)
        reject(err)
      else
        resolve(json && json.result)
    })
  })
}
