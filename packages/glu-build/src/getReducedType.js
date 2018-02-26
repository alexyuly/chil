const getTypeWithImports = require('./getTypeWithImports')
const getTypeWithVariables = require('./getTypeWithVariables')

const getReducedType = ({
  type,
  variables,
  imports,
  sourceDir,
}) => getTypeWithImports({
  type: variables
    ? getTypeWithVariables({
      type,
      variables,
    })
    : type,
  imports,
  sourceDir,
})

module.exports = getReducedType
