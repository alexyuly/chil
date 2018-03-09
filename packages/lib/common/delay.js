const store = require('../factories/store')

module.exports = store((state, action, next) => setTimeout(() => next(action), state))
