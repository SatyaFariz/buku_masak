const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'CustomerService',
  fields: {
    name: { 
      type: GraphQLString
    },
    whatsapp: {
      type: GraphQLString,
    },
    active: {
      type: GraphQLBoolean
    }
  }
})