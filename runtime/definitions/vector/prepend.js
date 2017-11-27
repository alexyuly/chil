const { store } = require('../../factory')

const prepend = store((operation) => operation.next([ operation.state ].concat(operation.queue.shift())))

module.exports = prepend
