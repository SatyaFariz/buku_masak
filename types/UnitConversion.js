const {
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

const Unit = require('./Unit')
const UnitLoader = require('../dataloader/UnitLoader')

module.exports = new GraphQLObjectType({
  name: 'UnitConversion',
  fields: {
    lowerValue: { 
      type: GraphQLFloat
    },
    upperValue: {
      type: GraphQLFloat
    },
    targetUnit: {
      type: Unit,
      resolve: async root => await UnitLoader.load(root.targetUnitId)
    },
    targetUnitLowerValue: {
      type: GraphQLFloat
    },
    targetUnitUpperValue: {
      type: GraphQLFloat
    }
  }
})