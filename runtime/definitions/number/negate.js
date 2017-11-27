const { pipe } = require('../../factory')

const negate = pipe((operation, action) => operation.next(-action))

module.exports = negate
