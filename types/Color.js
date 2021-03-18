const { GraphQLScalarType } = require('graphql')
const { isHexColor } = require('validator')

const parse = (value) => {
  if (isHexColor(value)) {
    return value
  }
  throw new Error('Not a valid hexadecimal color code.')
}

const serialize = (value) => {
  if (isHexColor(value)) {
    return value
  }
  throw new Error('Not a valid hexadecimal color code.')
}

const parseLiteral = (ast) => {
  if (isHexColor(ast.value)) {
    return ast.value
  }
  throw new Error('Not a valid hexadecimal color code.')
}

const Color = new GraphQLScalarType({
  name: 'Color',
  description: 'Color',
  serialize: serialize,
  parseValue: parse,
  parseLiteral: parseLiteral,
})

module.exports = Color