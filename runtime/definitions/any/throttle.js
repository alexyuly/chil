const { batch } = require('../../factories')

const throttle = batch(({ queue, next }) => {
    if (queue.length > 0) {
        next(queue.shift())
    }
})

module.exports = throttle
