const exceptions = require('../exceptions')
const types = require('../types')

class Value {
    constructor(instance = {}) {
        this.instance = instance
        this.listeners = []
    }

    connect(value) {
        if (!types.isApplicable(this.instance.of, value.instance.of)) {
            throw exceptions.typeNotApplicable(this.instance.of, value.instance.of)
        }
        this.listeners.push(value)
    }

    next(event) {
        const eventType = types.typeOf(event)
        if (!types.isApplicable(eventType, this.instance.of)) {
            throw exceptions.typeNotApplicable(eventType, this.instance.of)
        }
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
