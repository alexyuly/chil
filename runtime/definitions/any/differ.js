const { store } = require('../../factories')
const events = require('../../events')

const differ = store((operation) => {
    const action = operation.queue.shift()
    if (!events.compare(action, operation.state)) {
        operation.next(action)
    }
})

module.exports = differ
