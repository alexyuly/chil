const { pipe } = require('../../factories')

const count = pipe((operation, action) => operation.next(action.length))

module.exports = count
