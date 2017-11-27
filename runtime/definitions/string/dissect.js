const { pipe } = require('../../factory')

const dissect = pipe((operation, action) => {
    for (const character of action) {
        operation.next(character)
    }
})

module.exports = dissect
