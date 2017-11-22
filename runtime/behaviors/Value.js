const types = require('../types')

class Value {
    constructor(instance = {}) {
        this.instance = instance
        this.listeners = []
    }

    connect(value) {
        types.assertApplicable(this.instance.of, value.instance.of)
        this.listeners.push(value)
    }

    next(event) {
        types.assertApplicable(types.typeOf(event), this.instance.of)
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
