const {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLFloat
} = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'DeliveryAddressInput',
  fields: {
    address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
  }
})