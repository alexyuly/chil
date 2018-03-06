const connectedStream = ({
  logger,
}= {}) => {
  const connections = []
  return {
    connect: (connection) => {
      connections.push(connection)
    },
    next: (value) => {
      if (logger) {
        logger(value)
      }
      for (const connection of connections) {
        connection.next(value)
      }
    },
  }
}

module.exports = connectedStream
