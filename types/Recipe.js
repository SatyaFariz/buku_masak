const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const Image = require('./Image')
const Product = require('./Product')
const Ingredient = require('./Ingredient')
const CookingStep = require('./CookingStep')

const ProductLoader = require('../dataloader/ProductLoader')
const RecipeLoader = require('../dataloader/RecipeLoader')

const Recipe = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    id: { 
      type: GraphQLID
    },
    videoUrl: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    desc: {
      type: GraphQLString,
    },
    cookingTime: {
      type: GraphQLString,
    },
    published: {
      type: GraphQLBoolean,
    },
    parent: {
      type: GraphQLBoolean,
    },
    children: {
      type: new GraphQLList(Recipe),
      resolve: async root => {
        if(root.childrenIds.length === 0)
          return []

        return await Promise.all(root.childrenIds.map(id => RecipeLoader.load(id)))
      }
    },
    images: {
      type: new GraphQLList(Image)
    },
    serving: {
      type: GraphQLString
    },
    ingredients: {
      type: new GraphQLList(Ingredient)
    },
    steps: {
      type: new GraphQLList(CookingStep)
    },
    linkedProducts: {
      type: new GraphQLList(Product),
      resolve: async (root) => {
        const productIds = root.ingredients.map(item => item.productId).filter(item => item !== null)
        if(productIds.length === 0)
          return []
          
        const products = await Promise.all(productIds.map(id => ProductLoader.load(id)))
        return products.filter(item => item.published)
      }
    }
  })
})

module.exports = Recipe