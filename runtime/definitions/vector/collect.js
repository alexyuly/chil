const { store } = require('../../factories')

module.exports = store((operation) => {
    while (operation.queue.length >= operation.state) {
        operation.next(operation.queue.splice(0, operation.state))
    }
})
