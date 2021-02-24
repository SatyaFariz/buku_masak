const {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
} = require('graphql')

const UnitLoader = require('../dataloader/UnitLoader')
const CategoryLoader = require('../dataloader/CategoryLoader')
const UserLoader = require('../dataloader/UserLoader')
const Unit = require('./Unit')
const User = require('./User')
const Category = require('./Category')
const Image = require('./Image')
const UnitConversion = require('./UnitConversion')
const Discount = require('./Discount')
const isTodayBetween = require('../utils/isTodayBetween')
const userType = require('../constants/userType')
const isTodayBefore = require('../utils/isTodayBefore')

module.exports = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    desc: { 
      type: GraphQLString 
    },
    healthBenefits: {
      type: GraphQLString
    },
    prepAndStorage: {
      type: GraphQLString
    },
    pricePerUnitQty: {
      type: GraphQLFloat
    },
    maxOrder: {
      type: GraphQLInt
    },
    unitQty: {
      type: GraphQLFloat
    },
    published: {
      type: GraphQLBoolean
    },
    inStock: {
      type: GraphQLBoolean
    },
    categories: {
      type: new GraphQLList(Category),
      resolve: async root => {
        return await Promise.all(root.categoryIds.map(async item => await CategoryLoader.load(item)))
      }
    },
    unit: {
      type: Unit,
      resolve: async (root) => await UnitLoader.load(root.unitId)
    },
    unitConversion: {
      type: UnitConversion,
    },
    discount: {
      type: Discount,
      resolve: ({ discount, pricePerUnitQty }, _, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        if(discount) {
          if(isTodayBetween(discount.startDate, discount.endDate)) {
            return {
              ...discount.toJSON(),
              fullPrice: pricePerUnitQty
            }
          } else if(isAdmin && isTodayBefore(discount.startDate)) {
            return {
              ...discount.toJSON(),
              fullPrice: pricePerUnitQty
            }
          }
        }

        return null
      }
    },
    images: {
      type: new GraphQLList(Image)
    },
    mainImage: {
      type: Image,
      resolve: root => root.images.find(image => image.display === 1)
    },
    lastUpdatedBy: {
      type: User,
      resolve: async root => await UserLoader.load(root.lastUpdatedBy)
    }
  }
})