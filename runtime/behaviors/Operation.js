const Value = require('./Value')
const exceptions = require('../exceptions')
const types = require('../types')

class Operation extends Value {
    constructor(definition, instance) {
        super(instance)
        this.definition = types.construct(definition, instance)
    }

    constructValues(delegates = {}) {
        if (!types.isGraph(this.definition.values)) {
            throw exceptions.operationTypeNotValid(this.definition.name)
        }
        this.values = {}
        for (const key in this.definition.values) {
            const instance = this.definition.values[key]
            this.values[key] = this.value(instance, delegates[key])
        }
    }

    value(instance, delegate) {
        if (!delegate) {
            return new Value(instance)
        }
        const ValueClass = class extends Value {
            next(event) {
                delegate(event)
            }
        }
        return new ValueClass(instance)
    }
}

module.exports = Operation
