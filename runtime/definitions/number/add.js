const { store } = require('../../factory')

const add = store((operation) => operation.next(operation.queue.shift() + operation.state))

module.exports = add
