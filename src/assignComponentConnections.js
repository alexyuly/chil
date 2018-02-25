const assignComponentConnections = ({ component }) => {
  for (const originKey in component.operation.connections) {
    const origin = component.inputs[originKey] || component.children[originKey].output
    const targets = component.operation.connections[originKey]
    for (const targetKey in targets) {
      origin.connect(
        targetKey === 'output'
          ? component.output
          : component.children[targetKey].inputs[targets[targetKey]]
      )
    }
  }
}

module.exports = assignComponentConnections
