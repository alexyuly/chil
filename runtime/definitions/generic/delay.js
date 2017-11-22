const { valve } = require('../../factories')

const delay = valve((action, state, next) => setTimeout(() => next(action), state))

module.exports = delay
