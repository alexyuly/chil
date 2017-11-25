const { store } = require('../../factories')

const prepend = store((operation) => operation.next(operation.state + operation.queue.shift()))

module.exports = prepend
