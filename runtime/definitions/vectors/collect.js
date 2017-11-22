const { valve } = require('../../factories')

const collect = valve((action, state, next) => {
    (this.collection = this.collection || []).push(action)
    while (this.collection.length >= state) {
        next(this.collection.splice(0, state))
    }
})

module.exports = collect
