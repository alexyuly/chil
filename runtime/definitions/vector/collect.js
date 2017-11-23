const { store } = require('../../factories')

const collect = store(({ state, next }, action) => {
    (this.collection = this.collection || []).push(action)
    while (this.collection.length >= state) {
        next(this.collection.splice(0, state))
    }
})

module.exports = collect
