const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql')

const { GraphQLDateTime } = require('graphql-custom-types')

module.exports = new GraphQLInputObjectType({
  name: 'PlaceOrderInput',
  fields: {
    deliveryAddressId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    paymentMethodId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    deliveryDate: {
      type: new GraphQLNonNull(GraphQLDateTime)
    }
  }
})