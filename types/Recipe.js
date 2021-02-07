const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const Image = require('./Image')
const Ingredient = require('./Ingredient')

module.exports = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
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
    images: {
      type: new GraphQLList(Image)
    },
    servings: {
      type: new GraphQLList(GraphQLInt)
    },
    ingredients: {
      type: new GraphQLList(Ingredient)
    }
  }
})