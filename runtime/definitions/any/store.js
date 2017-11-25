const { store } = require('../../factories')

module.exports = store((operation) => operation.next(operation.state))
