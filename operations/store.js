const valve = require('../runtime/valve')

const store = valve((push, state) => push(state))

module.exports = store
