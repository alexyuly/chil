const { store } = require('../../factory')

const append = store((operation) => operation.next(operation.queue.shift().concat(operation.state)))

module.exports = append
