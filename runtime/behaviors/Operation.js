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
            this.values[name] = new ValueClass(this.definition.values[name], this.typeArguments)
        }
    }
}

module.exports = Operation
