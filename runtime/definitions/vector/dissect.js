const { pipe } = require('../../factory')

const dissect = pipe((operation, action) => {
    for (const element of action) {
        operation.next(element)
    }
})

module.exports = dissect
