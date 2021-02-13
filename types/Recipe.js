const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const Image = require('./Image')
const Ingredient = require('./Ingredient')
const CookingStep = require('./CookingStep')

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
    serving: {
      type: GraphQLString
    },
    ingredients: {
      type: new GraphQLList(Ingredient)
    },
    steps: {
      type: new GraphQLList(CookingStep)
    }
  }
})