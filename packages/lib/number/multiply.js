const reduce = require('../factories/reduce')

module.exports = reduce((state, action, next) => next(state * action))
