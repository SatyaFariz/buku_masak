const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull
} = require('graphql')

const PaymentMethod = require('./PaymentMethod')
const PlatformEnum = require('./PlatformEnum')
const platformType = require('../constants/platform')

module.exports = new GraphQLObjectType({
  name: 'AppConfig',
  fields: {
    id: { 
      type: GraphQLID
    },
    offDaysOfTheWeek: {
      type: new GraphQLList(GraphQLInt)
    },
    deliveryDaysThreshold: {
      type: GraphQLInt
    },
    packagingPrice: {
      type: GraphQLFloat
    },
    playStoreUrl: {
      type: GraphQLString
    },
    aboutUsUrl: {
      type: GraphQLString
    },
    faqUrl: {
      type: GraphQLString
    },
    privacyPolicyUrl: {
      type: GraphQLString
    },
    termsOfServiceUrl: {
      type: GraphQLString
    },
    feedbackUrl: {
      type: GraphQLString
    },
    instagramUrls: {
      type: new GraphQLList(GraphQLString)
    },
    facebookUrls: {
      type: new GraphQLList(GraphQLString),
      args: {
        platform: { type: PlatformEnum }
      },
      resolve: (root, { platform }) => {
        const regex = platformType.ANDROID === platform ? /profile/ : /page/
        return root.facebookUrls.filter(url => !regex.test(url))
      }
    },
    whatsappNumber: { 
      type: GraphQLString,
      resolve: root => root.whatsappNumbers[0]
    },
    whatsappNumbers: { 
      type: new GraphQLList(GraphQLString)
    },
    telegramChatIds: { 
      type: new GraphQLList(GraphQLInt)
    },
    paymentMethods: {
      type: new GraphQLList(PaymentMethod)
    }
  }
})