const { pipe } = require('../factories')

const dissect = pipe((action, next) => {
    for (const element of action) {
        next(element)
    }
})

module.exports = dissect
