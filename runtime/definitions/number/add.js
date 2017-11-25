const { store } = require('../../factories')

const add = store((operation) => operation.next(operation.queue.shift() + operation.state))

module.exports = add
