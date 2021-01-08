const { 
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql')

const { withFilter } = require('graphql-subscriptions')

const ActionOnNotificationPayload = require('./ActionOnNotificationPayload')

module.exports = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    newNotification: {
      type: ActionOnNotificationPayload,
      subscribe: withFilter((root, args, { pubsub }) => pubsub.asyncIterator('NEW_NOTIFICATION'), (payload, args, ctx) => {
        const { to } = payload
        const { user } = ctx.session

        if(user && to.map(item => item.toString()).includes(user.id.toString()))
          return true
        
        return false
        
      }),
      resolve: (root) => {
        console.log(root)
      }
    }, 
  })
})


