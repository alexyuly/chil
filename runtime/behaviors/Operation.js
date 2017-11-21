const Value = require('./Value')
const types = require('../types')

class Operation extends Value {
    constructor(definition, instance, typeArgs) {
        super(instance, typeArgs)
        this.definition = types.construct(definition, typeArgs)
        this.typeArgs = typeArgs
    }

    constructValues(delegates = {}) {
        this.values = {}
        for (const name in this.definition.values) {
            const ValueClass = delegates[name]
                ? class extends Value {
                    next(event) {
                        delegates[name](event)
                    }
                }
                : Value
            const instance = this.definition.values[name]
            this.values[name] = new ValueClass(instance, this.typeArgs)
        }
    }
}

module.exports = Operation
