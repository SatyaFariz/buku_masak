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
const Label = require('./Label')
const LabelLoader = require('../dataloader/LabelLoader')
const User = require('./User')
const Category = require('./Category')
const Image = require('./Image')
const RecipeLoader = require('../dataloader/RecipeLoader')
const UnitConversion = require('./UnitConversion')
const Discount = require('./Discount')
const isTodayBetween = require('../utils/isTodayBetween')
const userType = require('../constants/userType')
const isTodayBefore = require('../utils/isTodayBefore')

function arrayShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    desc: { 
      type: GraphQLString 
    },
    highlightedDesc: {
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
    labels: {
      type: new GraphQLList(Label),
      args: {
        ids: { type: new GraphQLList(GraphQLString) },
        first: { type: GraphQLInt }
      },
      resolve: async (root, { ids, first }) => {
        let labels = await Promise.all(root.labelIds.map(async item => await LabelLoader.load(item)))
        if(ids?.length > 0)
          labels = labels.filter(item => ids.includes(item._id.toString()))

        if(first)
          return labels.slice(0, first)

        return labels
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
      type: new GraphQLList(Image),
      args: {
        // the image at index 0 is the main image
        first: { type: GraphQLInt }
      },
      resolve: (root, { first }) => {
        if(first)
          return root.images.slice(0, first)
        
        return root.images
      }
    },
    mainImage: {
      type: Image,
      resolve: root => root.images.find(image => image.display === 1)
    },
    lastUpdatedBy: {
      type: User,
      resolve: async root => await UserLoader.load(root.lastUpdatedBy)
    },
    featuredRecipes: {
      type: new GraphQLList(require('./Recipe')),
      args: {
        first: { type: GraphQLInt }
      },
      resolve: async (root, { first }, { session: { user }}) => {
        if(root.featuredRecipeIds.length === 0)
          return []

        const ids = root.featuredRecipeIds

        const isAdmin = user?.userType === userType.ADMIN
        const AllRecipes = await Promise.all(ids.map(id =>
          RecipeLoader.load(id))
        )
        
        const recipes = arrayShuffle(AllRecipes.filter(recipe => {
          if(isAdmin)
            return true
          else
            return recipe.published
        }))

        return first > 0 ? recipes.slice(0, first) : recipes
      }
    }
  })
})

module.exports = Product