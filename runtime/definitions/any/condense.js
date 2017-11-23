const { batch } = require('../../factories')

const condense = batch(({ queue, next }) => {
    if (queue.length > 0) {
        next(queue.splice(0).shift())
    }
})

module.exports = condense
