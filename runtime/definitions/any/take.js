const { store } = require('../../factories')

const take = store((operation) => {
    if (operation.state-- > 0) {
        operation.next(operation.queue.shift())
    }
})

module.exports = take
