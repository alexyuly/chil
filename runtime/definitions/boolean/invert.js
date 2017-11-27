const { pipe } = require('../../factory')

const invert = pipe((operation, action) => operation.next(!action))

module.exports = invert
