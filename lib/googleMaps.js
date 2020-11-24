const gm = require('@google/maps')

const googleMaps = gm.createClient({
  key: process.env.GOOGLE_API_KEY,
  rate: { limit: 50 },
})

module.exports = googleMaps