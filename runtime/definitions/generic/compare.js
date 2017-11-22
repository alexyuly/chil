const { valve } = require('../../factories')
const types = require('../../types')

const compare = valve((action, state, next) => {
    if (types.compareEvents(action, state)) {
        next(action)
    }
})

module.exports = compare
