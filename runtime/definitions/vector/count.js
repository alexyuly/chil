const { pipe } = require('../../factories')

const count = pipe(({ next }, action) => next(action.length))

module.exports = count
