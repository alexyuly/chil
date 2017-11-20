const valve = require('../runtime/valve')

const add = valve((next, state, action) => next(state + action))

module.exports = add
