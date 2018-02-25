const createStream = require('./createStream')
const reduceType = require('./reduceType')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const assignComponentInputs = ({
  component,
  sourceDir,
}) => {
  component.inputs = {}
  const inputs = reduceTypeDictionary({
    dictionary: component.type.component.inputs,
    variables: component.variables,
  })
  for (const key in inputs) {
    component.inputs[key] = createStream({
      reducedType: reduceType({
        type: inputs[key],
        variables: component.variables,
        imports: component.imports,
        sourceDir,
      }),
    })
  }
}

module.exports = assignComponentInputs
