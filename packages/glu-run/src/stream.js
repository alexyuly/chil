const assert = require('assert')

const stream = (delegate) => {
  const connections = []
  return {
    connect: (connection) => {
      // This shouldn't ever happen:
      assert(!delegate, 'This stream cannot be connected, because its events are delegated.')
      connections.push(connection)
    },
    next: (event) => {
      if (delegate) {
        delegate(event)
      } else {
        for (const connection of connections) {
          connection.next(event)
        }
      }
    },
  }
}

module.exports = stream
