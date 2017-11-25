const { pipe } = require('../../factories')

const negate = pipe((operation, action) => operation.next(-action))

module.exports = negate
