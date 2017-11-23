const { store } = require('../../factories')

const take = store((operation, action) => {
    if (operation.state-- > 0) {
        operation.next(action)
    }
})

module.exports = take
