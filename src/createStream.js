const reduceType = require('./reduceType')
const validateReducedType = require('./validateReducedType')

const createStream = ({
  next,
  type,
  variables,
  imports,
  sourceDir,
}) => {
  const streams = []
  const reducedType = reduceType({
    type,
    variables,
    imports,
    sourceDir,
  })
  return {
    connect: !next && ((stream) => {
      validateReducedType({
        reducedType,
        reducedDomain: stream.reducedType,
      })
      streams.push(stream)
    }),
    next: (event) => {
      if (next) {
        next(event)
      } else {
        for (const value of streams) {
          value.next(event)
        }
      }
      // TODO - Write the current application state to disk.
    },
    reducedType,
  }
}

module.exports = createStream
