const { pipe } = require('../../factories')

const invert = pipe((operation, action) => operation.next(1 / action))

module.exports = invert
