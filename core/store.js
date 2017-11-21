const { valve } = require('../runtime/factories')

const store = valve((action, state, next) => next(state))

module.exports = store
