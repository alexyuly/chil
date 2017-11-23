const { pipe } = require('../../factories')

const slice_first = pipe(({ next }, action) => {
    if (action.length > 0) {
        next(action[0])
    }
})

module.exports = slice_first
