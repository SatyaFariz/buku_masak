const moment = require('moment')

module.exports = (startDate, endDate) => {
  return moment().isBetween(startDate, endDate, 'day')
}