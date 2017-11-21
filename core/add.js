const { valve } = require('../runtime/factories')

const add = valve((action, state, next) => next(action + state))

module.exports = add
