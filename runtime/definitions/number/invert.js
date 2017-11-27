const { pipe } = require('../../factory')

const invert = pipe((operation, action) => operation.next(1 / action))

module.exports = invert
