const { store } = require('../../factories')
const types = require('../../types')

const equate = store(({ state, next }, action) => {
    if (types.compareEvents(action, state)) {
        next(action)
    }
})

module.exports = equate
