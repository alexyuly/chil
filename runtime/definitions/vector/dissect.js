const { pipe } = require('../../factories')

const dissect = pipe((operation, action) => {
    for (const element of action) {
        operation.next(element)
    }
})

module.exports = dissect
