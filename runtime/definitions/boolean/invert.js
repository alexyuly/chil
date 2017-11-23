const { pipe } = require('../../factories')

const invert = pipe(({ next }, action) => next(!action))

module.exports = invert
