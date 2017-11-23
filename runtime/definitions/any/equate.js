const { store } = require('../../factories')
const events = require('../../events')

const equate = store(({ state, next }, action) => {
    if (events.compare(action, state)) {
        next(action)
    }
})

module.exports = equate
