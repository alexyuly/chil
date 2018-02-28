const runComponentConnections = ({ component }) => {
  for (const key in component.connections) {
    const origin = component.inputs[key] || component.children[key].output
    const connections = component.connections[key]
    for (const connectionKey in connections) {
      const connection = connectionKey === 'output'
        ? component.output
        : component.children[connectionKey].inputs[connections[connectionKey]]
      origin.connect(connection)
    }
  }
}

module.exports = runComponentConnections
