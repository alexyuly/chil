const { pipe } = require('../../factory')

const last = pipe((operation, action) => {
    if (action.length > 0) {
        operation.next(action[action.length - 1])
    }
})

module.exports = last
