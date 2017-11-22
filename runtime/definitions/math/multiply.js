const { valve } = require('../../factories')

const multiply = valve((action, state, next) => next(action * state))

module.exports = multiply
