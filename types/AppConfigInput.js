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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    instagramUrls: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    whatsappNumbers: {
      type: GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    telegramChatIds: {
      type: GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))
    },
    offDaysOfTheWeek: {
      type: GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))
    },
    packagingPrice: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    deliveryDaysThreshold: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})