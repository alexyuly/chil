const { pipe } = require('../../factories')

const invert = pipe((operation, action) => operation.next(!action))

module.exports = invert
