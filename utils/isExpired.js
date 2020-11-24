const moment = require('moment')

module.exports = (expiryDate) => {
  const now = new Date()
  return moment(now).isAfter(expiryDate)
}