const { pipe } = require('../../factories')

const negate = pipe(({ next }, action) => next(-action))

module.exports = negate
