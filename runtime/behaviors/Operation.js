const Value = require('./Value')
const exceptions = require('../exceptions')
const { construct } = require('../definitions')
const { isGraph } = require('../utility')

class Operation extends Value {
    constructor(definition, instance = { of: definition.name }, serialization) {
        super(instance, serialization)
        this.definition = construct(definition, instance.of)
    }

    constructValues(delegates = {}) {
        if (!isGraph(this.definition.values)) {
            throw exceptions.definitionNotValid(this.definition)
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
