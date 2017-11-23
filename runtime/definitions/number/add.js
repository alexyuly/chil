const { store } = require('../../factories')

const add = store(({ state, next }, action) => next(action + state))

module.exports = add
