const { valve } = require('../runtime/factories')

const collect = valve((action, state, next) => {
    (this.collection = this.collection || []).push(action)
    if (this.collection.length === state) {
        next(this.collection.splice(0))
    }
})

module.exports = collect
