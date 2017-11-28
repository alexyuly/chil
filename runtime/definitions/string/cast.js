const { pipe } = require('../../factory')

const cast = pipe((operation, action) => operation.next(String(action)))

module.exports = cast
