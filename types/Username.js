const { GraphQLScalarType } = require('graphql')

const isValidUsername = require('../utils/isValidUsername')

const parse = (value) => {
  if (isValidUsername(value)) {
    return value
  }
  throw new Error('Not a valid username')
}

const serialize = (value) => {
  if (isValidUsername(value)) {
    return value
  }
  throw new Error('Not a valid username')
}

const parseLiteral = (ast) => {
  if (isValidUsername(ast.value)) {
    return ast.value
  }
  throw new Error('Not a valid username')
}

const Username = new GraphQLScalarType({
  name: 'Username',
  description: 'Username',
  serialize: serialize,
  parseValue: parse,
  parseLiteral: parseLiteral,
})

module.exports = Username