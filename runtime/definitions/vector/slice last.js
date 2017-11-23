const { pipe } = require('../../factories')

const slice_last = pipe(({ next }, action) => {
    if (action.length > 0) {
        next(action[action.length - 1])
    }
})

module.exports = slice_last
