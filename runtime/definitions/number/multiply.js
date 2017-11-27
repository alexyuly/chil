const { store } = require('../../factory')

const multiply = store((operation) => operation.next(operation.queue.shift() * operation.state))

module.exports = multiply
