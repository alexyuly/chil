const { store } = require('../../factories')

const multiply = store(({ state, next }, action) => next(action * state))

module.exports = multiply
