const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} = require('graphql')

const PaymentMethod = require('./PaymentMethod')
const platformType = require('../constants/platform')
const userType = require('../constants/userType')
const User = require('./User')
const UserLoader = require('../dataloader/UserLoader')
const CustomerService = require('./CustomerService')
const Banner = require('./Banner')
const Link = require('./Link')

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
      resolve: (root, _, { req }) => {
        const { platform } = req.headers
        const regex = platformType.ANDROID === platform ? /profile/ : /page/
        return root.facebookUrls.filter(url => !regex.test(url))
      }
    },
    telegramChatIds: { 
      type: new GraphQLList(GraphQLInt)
    },
    paymentMethods: {
      type: new GraphQLList(PaymentMethod)
    },
    banners: {
      type: new GraphQLList(Banner)
    },
    customerService: {
      type: new GraphQLList(CustomerService),
      resolve: (root, _, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(isAdmin) 
          return root.customerService

        const active = root.customerService.filter(item => item.active)
        return [active[Math.floor(Math.random() * active.length)]]
      }
    },
    lastUpdatedBy: {
      type: User,
      resolve: async root => await UserLoader.load(root.lastUpdatedBy)
    },
    links: {
      type: new GraphQLList(Link)
    }
  }
})