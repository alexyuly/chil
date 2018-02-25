const reduceTypeWithImports = require('./reduceTypeWithImports')
const reduceTypeWithVariables = require('./reduceTypeWithVariables')

const reduceType = ({
  type,
  variables,
  imports,
  sourceDir,
}) => reduceTypeWithImports({
  type: variables
    ? reduceTypeWithVariables({
      type,
      variables,
    })
    : type,
  imports,
  sourceDir,
})

module.exports = reduceType
