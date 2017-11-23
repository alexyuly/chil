const { store } = require('../../factories')

const delay = store(({ state, next }, action) => {
    setTimeout(() => next(action), state)
})

module.exports = delay
