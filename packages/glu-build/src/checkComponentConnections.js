const checkReducedType = require('./checkReducedType')

const checkComponentConnections = ({ component }) => {
  for (const key in component.operation.connections) {
    const origin = component.inputs[key] || component.children[key].output
    const connections = component.operation.connections[key]
    for (const connectionKey in connections) {
      const connection = connectionKey === 'output'
        ? component.output
        : component.children[connectionKey].inputs[connections[connectionKey]]
      checkReducedType({
        reducedType: origin.type,
        reducedDomain: connection.type,
      })
    }
  }
}

module.exports = checkComponentConnections
