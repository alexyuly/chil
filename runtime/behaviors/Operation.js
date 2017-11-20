const Value = require('./Value')

class Operation extends Value {
    constructor(...args) {
        super(...args)
        this.values = {}
    }

    constructValues(delegate) {
        const delegates = delegate(this.next)
        for (const name in delegates) {
            const ValueClass = class extends Value {
                next(event) {
                    delegates[name](event)
                }
            }
            const definition = this.definition.values[name]
            this.values[name] = new ValueClass(definition, this.typeArguments)
        }
    }
}

module.exports = Operation
