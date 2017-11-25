const { store } = require('../../factories')

const append = store((operation) => operation.next(operation.queue.shift() + operation.state))

module.exports = append
