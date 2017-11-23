const { valve } = require('../../factories')
const types = require('../../types')

const differ = valve((action, state, next) => {
    if (!types.compareEvents(action, state)) {
        next(action)
    }
})

module.exports = differ
