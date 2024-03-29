const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Image = require('./Image')
const User = require('./User')
const UserLoader = require('../dataloader/UserLoader')
const ProductLoader = require('../dataloader/ProductLoader')
const RecipeLoader = require('../dataloader/RecipeLoader')
const userType = require('../constants/userType')
const CollectionItem = require('./CollectionItem')

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

module.exports = new GraphQLObjectType({
  name: 'Collection',
  fields: {
    id: { 
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
    },
    desc: {
      type: GraphQLString
    },
    published: {
      type: GraphQLBoolean
    },
    image: {
      type: Image
    },
    images: {
      type: new GraphQLList(Image)
    },
    type: {
      type: GraphQLString
    },
    items: {
      type: new GraphQLList(CollectionItem),
      args: {
        first: { type: GraphQLInt }
      },
      resolve: async (root, { first }, { session: { user }}) => {
        if(root.itemIds.length === 0)
          return []

        const itemIds = root.exclude?.length > 0 ? root.itemIds.filter(id => {
          return !root.exclude.map(id => id.toString()).includes(id.toString())
        }) : root.itemIds

        const isAdmin = user?.userType === userType.ADMIN
        if(root.type === 'product') {
          const AllProducts = await Promise.all(itemIds.map(id =>
            ProductLoader.load(id))
          )
          
          const products = arrayShuffle(AllProducts.filter(product => {
            if(isAdmin)
              return true
            else
              return product.published
          }))
  
          return first > 0 ? products.slice(0, first) : products
        } else {
          const AllRecipes = await Promise.all(itemIds.map(id =>
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
    },
    lastUpdatedBy: {
      type: User,
      resolve: async (root) => await UserLoader.load(root.lastUpdatedBy)
    }
  }
})