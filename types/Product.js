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
const Unit = require('./Unit')
const Category = require('./Category')
const Image = require('./Image')
const UnitConversion = require('./UnitConversion')

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
    images: {
      type: new GraphQLList(Image)
    },
    mainImage: {
      type: Image,
      resolve: root => root.images.find(image => image.display === 1)
    }
  }
})