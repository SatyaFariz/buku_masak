const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'AppUpdate',
  fields: () => ({
    versionName: {
      type: GraphQLString,
      resolve: root => root.version_name
    },
    versionCode: {
      type: GraphQLString,
      resolve: root => root.version_code
    },
    forceUpdate: {
      type: GraphQLBoolean,
      resolve: root => root.force_update
    }
  })
})