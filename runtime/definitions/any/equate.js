const { valve } = require('../../factories')
const types = require('../../types')

const equate = valve((action, state, next) => {
    if (types.compareEvents(action, state)) {
        next(action)
    }
})

module.exports = equate
