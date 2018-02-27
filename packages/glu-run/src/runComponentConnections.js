const runComponentConnections = ({ component }) => {
  for (const key in component.composition.connections) {
    const origin = component.inputs[key] || component.children[key].output
    const connections = component.composition.connections[key]
    for (const connectionKey in connections) {
      const connection = connectionKey === 'output'
        ? component.output
        : component.children[connectionKey].inputs[connections[connectionKey]]
      origin.connect(connection)
    }
  }
}

module.exports = runComponentConnections
