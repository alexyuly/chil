const { pipe } = require('../../factories')

const cast = pipe((operation, action) => operation.next(Number(action)))

module.exports = cast
