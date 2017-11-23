const { pipe } = require('../../factories')

const invert = pipe(({ next }, action) => next(1 / action))

module.exports = invert
