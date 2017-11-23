const { store } = require('../../factories')

const union = store(({ state, next }, action) => next(action || state))

module.exports = union
