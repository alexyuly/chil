const { store } = require('../../factories')

const both = store((operation) => operation.next(operation.queue.shift() && operation.state))

module.exports = both
