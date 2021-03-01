const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'CustomerServiceInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    whatsapp: {
      type: new GraphQLNonNull(GraphQLString)
    },
    active: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }
})