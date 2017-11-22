const { pipe } = require('../../factories')

const last = pipe((action, next) => {
    if (action.length > 0) {
        next(action[action.length - 1])
    }
})

module.exports = last
