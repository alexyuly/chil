const { store } = require('../../factories')

const intersect = store(({ state, next }, action) => next(action && state))

module.exports = intersect
