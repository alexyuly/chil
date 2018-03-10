const reduce = require('../factories/reduce')

module.exports = reduce((state, action, next) => setTimeout(() => next(action), state))
