const valve = require('../runtime/valve')

const multiply = valve((push, state, action) => push(state * action))

module.exports = multiply
