const OffDayModel = require('../database/models/OffDay')
const moment = require('moment')

module.exports = async () => {
  const options = { 
    sort: { date: 1 }, 
    limit: 30
  }

  const start = moment().startOf('day')

  const query = { date: { $gte: start }}

  const docs = await OffDayModel.find(query, null, options)
  return docs.map(item => item.date.toISOString())
  
}