const getReducedType = require('./getReducedType')
const mapDictionary = require('./mapDictionary')

const assignComponentInputs = ({
  component,
  sourceDir,
}) => {
  component.inputs = {}
  const inputs = mapDictionary({
    dictionary: component.type.component.inputs,
    variables: component.variables,
  })
  for (const key in inputs) {
    component.inputs[key] = {
      type: getReducedType({
        type: inputs[key],
        variables: component.variables,
        imports: component.imports,
        sourceDir,
      }),
    }
  }
}

module.exports = assignComponentInputs
