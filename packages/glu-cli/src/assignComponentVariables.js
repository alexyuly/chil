const isNonNullObject = require('./isNonNullObject')
const reduceType = require('./reduceType')
const validateReducedType = require('./validateReducedType')

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
    validateReducedType({
      reducedType: variables[key],
      reducedDomain: reduceType({
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
