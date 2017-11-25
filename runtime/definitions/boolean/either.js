const { store } = require('../../factories')

const either = store((operation) => operation.next(operation.queue.shift() || operation.state))

module.exports = either
