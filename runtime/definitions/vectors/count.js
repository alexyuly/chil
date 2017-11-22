const { pipe } = require('../../factories')

const count = pipe((action, next) => next(action.length))

module.exports = count
