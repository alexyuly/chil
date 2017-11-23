const { pipe } = require('../../factories')

const invert = pipe((action, next) => next(!action))

module.exports = invert
