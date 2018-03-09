const store = require('../factories/store')

module.exports = store((state, action, next) => next(state + action))
