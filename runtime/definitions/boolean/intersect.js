const { pipe } = require('../../factories')

const intersect = pipe((action, next) => next(action))

module.exports = intersect
