const reduceTypeDictionary = require('./reduceTypeDictionary')

const assignComponentModule = ({
  component,
  modulePath,
}) => {
  const methods = require(modulePath)(component)

  component.inputs = {}
  const inputs = reduceTypeDictionary({
    dictionary: component.type.component.inputs,
    variables: component.variables,
  })
  for (const inputName in inputs) {
    component.inputs[inputName] = {
      next: methods[inputName],
      reducedType: inputs[inputName],
    }
  }
}

module.exports = assignComponentModule
