const delegatedStream = ({
  logger,
  method,
}) => ({
  next: (value) => {
    logger(value)
    method(value)
  },
})

module.exports = delegatedStream
