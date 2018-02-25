const validateReducedType = require('./validateReducedType')

const createStream = ({ reducedType }) => {
  const streams = []
  return {
    connect: (stream) => {
      validateReducedType({
        reducedType,
        reducedDomain: stream.reducedType,
      })
      streams.push(stream)
    },
    next: (event) => {
      for (const value of streams) {
        value.next(event)
      }
    },
    reducedType,
  }
}

module.exports = createStream
