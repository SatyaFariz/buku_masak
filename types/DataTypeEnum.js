const {
  GraphQLEnumType,
} = require('graphql')

module.exports = new GraphQLEnumType({
  name: 'DataTypeEnum',
  values: {
    integer: {
      value: 'integer'
    },
    float: {
      value: 'float'
    },
    string: {
      value: 'string'
    },
    object: {
      value: 'object'
    },
    boolean: {
      value: 'boolean'
    }
  }
})