const exceptions = require('../exceptions')
const types = require('../types')

class Value {
    constructor(instance, typeArgs) {
        this.instance = types.construct(instance, typeArgs)
        this.listeners = []
    }

    connect(value) {
        if (!types.isApplicable(this.instance.of, value.instance.of)) {
            throw exceptions.typeNotApplicable(this.instance.of, value.instance.of)
        }
        this.listeners.push(value)
    }

    next(event) {
        const valueType = types.inferValueType(event)
        if (!types.isApplicable(valueType, this.instance.of)) {
            throw exceptions.typeNotApplicable(valueType, this.instance.of)
        }
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
