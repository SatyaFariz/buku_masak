const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'PaymentMethodInput',
  fields: {
    display: {
      type: new GraphQLNonNull(GraphQLString)
    },
    code: {
      type: new GraphQLNonNull(GraphQLString)
    },
    published: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
  }
})