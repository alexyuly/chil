const { pipe } = require('../runtime/factories')

const cast_number = pipe((action, next) => next(Number(action)))

module.exports = cast_number
