const polyline = require('@mapbox/polyline')
const googleMaps = require('../lib/googleMaps')
const OrderModel = require('../database/models/Order')

module.exports = async (origin, orderId) => {
  const order = await OrderModel.findById(orderId)
  const destination = {
    lat: order.deliveryAddress.lat,
    lng: order.deliveryAddress.lng
  }
  
  return new Promise((resolve, reject) => {
    googleMaps.directions({
      origin,
      destination
    }, (err, res) => {
      if(err)
        console.log(err)
      else {
        const { json } = res
        const { overview_polyline, summary } = json.routes[0]
        let points = polyline.decode(overview_polyline.points);

        const polylineCoordinates = points.map((point, index) => ({
          lat: point[0],
          lng : point[1]
        }))
        
        resolve({
          polylineCoordinates,
          destination,
          summary
        })
      }
    })
  })
}
