const { store } = require('../../factories')

const replace = store((operation) => {
    operation.queue.shift()
    operation.next(operation.state)
})

module.exports = replace
