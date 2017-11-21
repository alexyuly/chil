const { valve } = require('../runtime/factories')
const types = require('../runtime/types')

const equal = valve((action, state, next) => {
    if (types.isEqual(action, state)) {
        next(action)
    }
})

module.exports = equal
