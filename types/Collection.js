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
        count: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (root) => {
        return arrayShuffle(await Promise.all(root.productIds.map(id =>
          ProductLoader.load(id))
        ))
      }
    }
  }
})