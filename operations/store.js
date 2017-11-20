const valve = require('../runtime/valve')

const store = valve((next, state) => next(state))

module.exports = store
