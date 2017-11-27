const { pipe } = require('../../factory')

const cast = pipe((operation, action) => operation.next(Number(action)))

module.exports = cast
