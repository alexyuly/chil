const { store } = require('../../factory')

const append = store((operation) => operation.next(operation.queue.shift() + operation.state))

module.exports = append
