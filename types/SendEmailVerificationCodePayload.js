const {
  GraphQLObjectType
} = require('graphql')

const ActionInfo = require('./ActionInfo')
const EmailVerification = require('./EmailVerification')

module.exports = new GraphQLObjectType({
  name: 'SendEmailVerificationCodePayload',
  fields: {
    actionInfo: { 
      type: ActionInfo
    },
    emailVerification: {
      type: EmailVerification,
    },
  }
})