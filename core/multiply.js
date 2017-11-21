const { valve } = require('../runtime/factories')

const multiply = valve((action, state, next) => next(action * state))

module.exports = multiply
