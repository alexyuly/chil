const { store } = require('../../factory')

const prepend = store((operation) => operation.next(operation.state + operation.queue.shift()))

module.exports = prepend
