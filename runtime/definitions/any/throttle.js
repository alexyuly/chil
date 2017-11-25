const { batch } = require('../../factories')

const throttle = batch((operation) => {
    if (operation.queue.length > 0) {
        operation.next(operation.queue.shift())
    }
})

module.exports = throttle
