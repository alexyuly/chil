const { pipe } = require('../../factories')

const dissect = pipe(({ next }, action) => {
    for (const element of action) {
        next(element)
    }
})

module.exports = dissect
