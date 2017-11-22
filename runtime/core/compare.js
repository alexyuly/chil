const { valve } = require('../factories')
const types = require('../types')

const compare = valve((action, state, next) => {
    if (types.isEqual(action, state)) {
        next(action)
    }
})

module.exports = compare
