const { store } = require('../../factory')

const delay = store((operation) => {
    setTimeout(() => operation.next(operation.queue.shift()), operation.state)
})

module.exports = delay
