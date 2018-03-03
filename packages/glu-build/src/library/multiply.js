const store = require('./utilities/store')

module.exports = store((state, action, next) => next(state * action))
