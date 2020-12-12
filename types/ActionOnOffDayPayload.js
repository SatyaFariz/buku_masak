const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const getUpcomingOffDays = require('../utils/getUpcomingOffDays')

module.exports = new GraphQLObjectType({
  name: 'ActionOnOffDayPayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    upcomingOffDays: {
      type: new GraphQLList(GraphQLString),
      resolve: getUpcomingOffDays
    },
  }
})