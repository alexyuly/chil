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
        const eventType = types.inferType(event)
        const sinkType = this.definition.sink.of
        if (!types.applies(eventType, sinkType)) {
            throw exceptions.broadcastTypeApplication(eventType, sinkType)
        }
        for (const { operation, source } of this.sinks) {
            operation[source](event)
        }
    }
    connect(operation, source) {
        const sinkType = this.definition.sink.of
        const sourceType = operation.definition.sources[source].of
        if (!types.applies(sinkType, sourceType)) {
            throw exceptions.connectTypeApplication(sinkType, sourceType)
        }
        this.sinks.push({ operation, source })
    }
}

module.exports = Operation
