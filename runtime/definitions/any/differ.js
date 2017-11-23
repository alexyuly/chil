const { store } = require('../../factories')
const events = require('../../events')

const differ = store(({ state, next }, action) => {
    if (!events.compare(action, state)) {
        next(action)
    }
})

module.exports = differ
