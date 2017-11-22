const { pipe } = require('../factories')

const cast_number = pipe((action, next) => next(Number(action)))

module.exports = cast_number
