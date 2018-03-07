const delegatedStream = ({
  logger,
  method,
}) => ({
  next: (value) => {
    if (logger) {
      logger(value)
    }
    method(value)
  },
})

module.exports = delegatedStream
