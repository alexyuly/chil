const path = require('path')
const createStream = require('./createStream')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const assignComponentModule = ({
  component,
  sourceDir,
  sourceName,
}) => {
  const modulePath = path.resolve(sourceDir, `${sourceName}.js`)
  const moduleMethods = require(modulePath)(component)

  component.inputs = {}
  const inputs = reduceTypeDictionary({
    dictionary: component.type.component.inputs,
    variables: component.variables,
  })
  for (const key in inputs) {
    component.inputs[key] = createStream({
      next: moduleMethods[key],
      type: inputs[key],
      variables: component.variables,
      imports: component.imports,
      sourceDir,
    })
  }
}

module.exports = assignComponentModule
