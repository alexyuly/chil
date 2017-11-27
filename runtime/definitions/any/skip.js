const { store } = require('../../factory')

const skip = store((operation) => {
    if (--operation.state < 0) {
        operation.next(operation.queue.shift())
    }
})

module.exports = skip
