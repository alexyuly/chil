const reduceType = require('./reduceType')
const validateReducedType = require('./validateReducedType')

const createStream = ({
  next,
  type,
  variables,
  imports,
  sourceDir,
}) => {
  const connections = []
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
      connections.push(stream)
    }),
    next: (event) => {
      if (next) {
        next(event)
      } else {
        for (const stream of connections) {
          stream.next(event)
        }
      }
      // TODO - Write the current application state to disk.
    },
    reducedType,
  }
}

module.exports = createStream
