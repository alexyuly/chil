const { store } = require('../../factories')

const skip = store((operation, action) => {
    if (--operation.state < 0) {
        operation.next(action)
    }
})

module.exports = skip
