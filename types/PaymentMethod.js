const {
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'PaymentMethod',
  fields: {
    id: { 
      type: GraphQLID
    },
    display: {
      type: GraphQLString,
    },
    code: {
      type: GraphQLString,
    },
    default: {
      type: GraphQLBoolean
    },
  }
})