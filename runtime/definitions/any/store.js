const { valve } = require('../../factories')

const store = valve((action, state, next) => next(state))

module.exports = store
