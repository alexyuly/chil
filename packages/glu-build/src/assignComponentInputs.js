const getReducedType = require('./getReducedType')
const getReducedTypeDictionary = require('./getReducedTypeDictionary')

const assignComponentInputs = ({
  component,
  sourceDir,
}) => {
  component.inputs = {}
  const inputs = getReducedTypeDictionary({
    dictionary: component.type.component.inputs,
    variables: component.variables,
  })
  for (const key in inputs) {
    component.inputs[key] = {
      reducedType: getReducedType({
        type: inputs[key],
        variables: component.variables,
        imports: component.imports,
        sourceDir,
      }),
    }
  }
}

module.exports = assignComponentInputs
