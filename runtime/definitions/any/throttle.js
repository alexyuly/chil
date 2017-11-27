const { batch } = require('../../factory')

const throttle = batch((operation) => {
    if (operation.queue.length > 0) {
        operation.next(operation.queue.shift())
    }
})

module.exports = throttle
