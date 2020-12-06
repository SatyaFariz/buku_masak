const moment = require('moment')

module.exports = (date) => {
  return moment().isBefore(date)
}