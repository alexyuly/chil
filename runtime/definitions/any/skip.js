const { store } = require('../../factories')

const skip = store((operation) => {
    if (--operation.state < 0) {
        operation.next(operation.queue.shift())
    }
})

module.exports = skip
