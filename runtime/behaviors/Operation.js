const Value = require('./Value')
const exceptions = require('../exceptions')
const types = require('../types')

class Operation extends Value {
    constructor(definition, typeArguments) {
        super(types.deriveType(definition, typeArguments))
        this.definition = types.deriveDefinition(definition, typeArguments)
        this.sinks = []
    }
    broadcast(event) {
        if (!types.applies(types.inferType(event), this.definition.sink.of)) {
            throw exceptions.broadcastTypeApplication()
        }
        for (const { operation, source } of this.sinks) {
            operation[source](event)
        }
    }
    connect(operation, source) {
        if (!types.applies(this.definition.sink.of, operation.definition.sources[source].of)) {
            throw new Error('operation sink type does not match source type')
        }
        this.sinks.push({ operation, source })
    }
}

module.exports = Operation
