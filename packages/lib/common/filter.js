const reduce = require('../factories/reduce')

module.exports = reduce((state, action, next) => {
  if (state) {
    next(action)
  }
})
