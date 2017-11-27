const { pipe } = require('../../factory')

const count = pipe((operation, action) => operation.next(action.length))

module.exports = count
