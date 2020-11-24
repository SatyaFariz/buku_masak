const {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'DeliveryAddress',
  fields: {
    id: { 
      type: GraphQLID
    },
    lat: {
      type: GraphQLFloat,
    },
    lng: {
      type: GraphQLFloat
    },
    address: {
      type: GraphQLString
    },
    default: {
      type: GraphQLBoolean
    },
    googleMapsUrl: {
      type: GraphQLString,
      resolve: root => `google.navigation:q=${root.lat},${root.lng}&mode=d`
    }
  }
})