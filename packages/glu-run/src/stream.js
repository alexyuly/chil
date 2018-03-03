const assert = require('assert')

const stream = ({
  delegateNext,
  willReceiveNext,
} = {}) => {
  const connections = []
  return {
    connect: (connection) => {
      assert(!delegateNext, 'This stream cannot be connected, because its events are delegated.')
      connections.push(connection)
    },
    next: (event) => {
      if (willReceiveNext) {
        willReceiveNext(event)
      }
      if (delegateNext) {
        delegateNext(event)
      } else {
        for (const connection of connections) {
          connection.next(event)
        }
      }
    },
  }
}

module.exports = stream
