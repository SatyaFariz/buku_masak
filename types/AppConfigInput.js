const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'AppConfigInput',
  fields: {
    aboutUsUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    faqUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    privacyPolicyUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    termsOfServiceUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    feedbackUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    playStoreUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    termsOfServiceUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    facebookUrls: {
      type: new GraphQLList(new GraphQLNonNull(new GraphQLList(GraphQLString)))
    },
    instagramUrls: {
      type: new GraphQLList(new GraphQLNonNull(new GraphQLList(GraphQLString)))
    },
    whatsappNumbers: {
      type: new GraphQLList(new GraphQLNonNull(new GraphQLList(GraphQLString)))
    },
    telegramChatIds: {
      type: new GraphQLList(new GraphQLNonNull(new GraphQLList(GraphQLInt)))
    },
    offDaysOffTheWeek: {
      type: new GraphQLList(new GraphQLNonNull(new GraphQLList(GraphQLInt)))
    },
    packagingPrice: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    deliveryDaysThreshold: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})