const { pipe } = require('../runtime/factories')

const negate = pipe((action, next) => next(-action))

module.exports = negate
