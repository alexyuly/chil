const Serializable = require('../serialization/Serializable')
const { assertApplicable } = require('../types')
const { typeOf } = require('../events')

class Value extends Serializable {
    constructor(instance = {}, serialization) {
        super(serialization)
        this.instance = instance
        this.listeners = []
    }

    connect(value) {
        assertApplicable(this.instance.of, value.instance.of)
        this.listeners.push(value)
    }

    next(event) {
        assertApplicable(typeOf(event), this.instance.of)
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
