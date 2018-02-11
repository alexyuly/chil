const assert = require('assert')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const createStream = require('./createStream')

const createComponent = (pathToSource) => {
  const file = fs.readFileSync(pathToSource, 'utf8')
  const source = yaml.safeLoad(file)
  assert(
    source.type.component,
    'Cannot create a component from a source with a non-component type'
  )
  source.inputs = {}
  source.output = createStream(source.type.component.output)
  const sourceInfo = path.parse(pathToSource)
  if (source.operation) {
    for (const inputName in source.type.component.inputs) {
      const inputType = source.type.component.inputs[inputName]
      source.inputs[inputName] = createStream(inputType)
    }
    source.children = {}
    for (const childName in source.operation.children) {
      const childTypeName = source.operation.children[childName]
      const childPathToSource = path.resolve(sourceInfo.dir, source.imports[childTypeName])
      source.children[childName] = createComponent(childPathToSource)
    }
    for (const connection of source.operation.connections) {
      const origin = source.inputs[connection.origin] || source.children[connection.origin].output
      const target = connection.target === 'output'
        ? source.output
        : source.children[connection.target.child].inputs[connection.target.input]
      origin.connect(target)
    }
  } else {
    const pathToModule = path.resolve(sourceInfo.dir, `${sourceInfo.name}.js`)
    const inputs = require(pathToModule)(source.output)
    for (const inputName in source.type.component.inputs) {
      assert(
        inputs[inputName],
        'Cannot create a component input with no operation and no module method'
      )
      source.inputs[inputName] = {
        next: inputs[inputName],
        type: source.type.component.inputs[inputName],
      }
    }
  }
  return source
}

module.exports = createComponent
