const assert = require('assert')
const Serializable = require('../serialization/Serializable')
const { isApplicable } = require('../type')
const { typeOf } = require('../event')

class Value extends Serializable {
    constructor(instance = {}, serialization) {
        super(serialization)
        this.instance = instance
        this.listeners = []
    }

    connect(value) {
        assert(
            isApplicable(this.instance.of, value.instance.of),
            `cannot connect value of ${JSON.stringify(this.instance.of)} to value of ${JSON.stringify(value.instance.of)}`
        )
        this.listeners.push(value)
    }

    next(event) {
        assert(
            isApplicable(typeOf(event), this.instance.of),
            `cannot apply event ${JSON.stringify(event)} to value of ${JSON.stringify(this.instance.of)}`
        )
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
