const { batch } = require('../../factories')

const condense = batch((operation) => {
    if (operation.queue.length > 0) {
        operation.next(operation.queue.splice(0).shift())
    }
})

module.exports = condense
