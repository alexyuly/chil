const valve = require('../runtime/valve')

const delay = valve((next, state, action) => setTimeout(() => next(action), state))

module.exports = delay
