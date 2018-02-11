const assertTypeOfType = require('./assertTypeOfType')

module.exports = (type) => {
  const connections = []
  return {
    connect: (stream) => {
      assertTypeOfType(type, stream.type)
      connections.push(stream)
    },
    next: (event) => {
      for (const stream of connections) {
        stream.next(event)
      }
    },
    type,
  }
}
