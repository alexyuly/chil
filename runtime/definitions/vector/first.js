const { pipe } = require('../../factories')

const first = pipe((operation, action) => {
    if (action.length > 0) {
        operation.next(action[0])
    }
})

module.exports = first
