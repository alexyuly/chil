const { pipe } = require('../runtime/factories')

const invert = pipe((action, next) => next(1 / action))

module.exports = invert
