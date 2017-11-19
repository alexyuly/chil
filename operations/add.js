const valve = require('../runtime/valve')

const add = valve((push, state, action) => push(state + action))

module.exports = add
