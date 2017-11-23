const Value = require('./Value')
const definitions = require('../definitions')
const exceptions = require('../exceptions')
const graph = require('../graph')

class Operation extends Value {
    constructor(definition, instance = { of: definition.name }, serialization) {
        super(instance, serialization)
        this.definition = definitions.construct(definition, instance)
    }

    constructValues(delegates = {}) {
        if (!graph(this.definition.values)) {
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
