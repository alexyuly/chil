const valve = require('../runtime/valve')

const multiply = valve((next, state, action) => next(state * action))

module.exports = multiply
