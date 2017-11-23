const { store } = require('../../factories')

module.exports = store(({ next, state }) => next(state))
