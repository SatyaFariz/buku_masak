const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

const IngredientInput = require('./IngredientInput')

module.exports = new GraphQLInputObjectType({
  name: 'RecipeInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    categoryIds: { 
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    serving: {
      type: new GraphQLNonNull(GraphQLString),
    },
    published: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    parent: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    cookingTime: {
      type: GraphQLString
    },
    desc: {
      type: GraphQLString
    },
    videoUrl: {
      type: GraphQLString
    },
    ingredients: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(IngredientInput)))
    }
  }
})