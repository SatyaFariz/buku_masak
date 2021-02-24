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
const Product = require('./Product')
const ProductLoader = require('../dataloader/ProductLoader')
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
    products: {
      type: new GraphQLList(Product),
      args: {
        first: { type: GraphQLInt }
      },
      resolve: async (root, { first }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        const AllProducts = await Promise.all(root.productIds.map(id =>
          ProductLoader.load(id))
        )
        
        const products = arrayShuffle(AllProducts.filter(product => {
          if(isAdmin)
            return true
          else
            return product.published
        }))

        return first > 0 ? products.slice(0, first) : products
      }
    },
    items: {
      type: new GraphQLList(CollectionItem),
      args: {
        first: { type: GraphQLInt }
      },
      resolve: async (root, { first }, { session: { user }}) => {
        const isAdmin = user?.userType === userType.ADMIN
        const AllProducts = await Promise.all(root.productIds.map(id =>
          ProductLoader.load(id))
        )
        
        const products = arrayShuffle(AllProducts.filter(product => {
          if(isAdmin)
            return true
          else
            return product.published
        }))

        return first > 0 ? products.slice(0, first) : products
      }
    }
  }
})