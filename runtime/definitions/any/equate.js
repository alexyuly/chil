const { store } = require('../../factory')
const events = require('../../event')

const equate = store((operation) => {
    const action = operation.queue.shift()
    if (events.compare(action, operation.state)) {
        operation.next(action)
    }
})

module.exports = equate
