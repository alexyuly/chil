const { store } = require('../../factories')
const types = require('../../types')

const differ = store(({ state, next }, action) => {
    if (!types.compareEvents(action, state)) {
        next(action)
    }
})

module.exports = differ
