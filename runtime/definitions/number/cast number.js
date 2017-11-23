const { pipe } = require('../../factories')

const cast_number = pipe(({ next }, action) => next(Number(action)))

module.exports = cast_number
