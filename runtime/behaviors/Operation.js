const exceptions = require('../exceptions')
const types = require('../types')

class Operation {
    constructor(definition, typeArguments) {
        this.definition = types.applyDefinition(definition, typeArguments)
        this.type = typeArguments
            ? { [definition.name]: typeArguments, }
            : definition.name
        this.sinks = []
    }

    broadcast(event) {
        const eventType = types.inferType(event)
        const sinkType = this.definition.sink.of
        if (!types.isApplicable(eventType, sinkType)) {
            throw exceptions.typeNotApplicable(eventType, sinkType)
        }
        for (const { operation, source, } of this.sinks) {
            operation[source](event)
        }
    }

    connect(operation, source) {
        const sinkType = this.definition.sink.of
        const sourceType = operation.definition.sources[source].of
        if (!types.isApplicable(sinkType, sourceType)) {
            throw exceptions.typeNotApplicable(sinkType, sourceType)
        }
        this.sinks.push({
            operation,
            source,
        })
    }
}

module.exports = Operation
