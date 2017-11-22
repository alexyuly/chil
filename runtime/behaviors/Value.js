const Serializable = require('../serialization/Serializable')
const types = require('../types')

class Value extends Serializable {
    constructor(instance = {}, serialization) {
        super(serialization)
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
