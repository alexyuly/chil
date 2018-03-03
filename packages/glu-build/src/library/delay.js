const store = require('./utilities/store')

module.exports = store((state, action, next) => setTimeout(() => next(action), state))
