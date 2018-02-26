const checkReducedType = require('./checkReducedType')
const getReducedType = require('./getReducedType')
const isNonNullObject = require('./isNonNullObject')

const assignComponentVariables = ({
  component,
  variables,
  sourceDir,
}) => {
  if (!isNonNullObject(variables)) {
    return
  }
  if (!isNonNullObject(component.variables)) {
    component.variables = {}
  }
  for (const key in variables) {
    checkReducedType({
      reducedType: variables[key],
      reducedDomain: getReducedType({
        type: component.variables[key],
        variables: component.variables,
        imports: component.imports,
        sourceDir,
      }),
    })
    component.variables[key] = variables[key]
  }
}

module.exports = assignComponentVariables
