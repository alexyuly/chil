const valve = require('../runtime/valve')

const delay = valve((push, state, action) => setTimeout(() => push(action), state))

module.exports = delay
