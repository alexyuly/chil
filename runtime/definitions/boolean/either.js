const { store } = require('../../factory')

const either = store((operation) => operation.next(operation.queue.shift() || operation.state))

module.exports = either
