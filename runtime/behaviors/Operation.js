const exceptions = require('../exceptions')
const types = require('../types')

class Operation {
    constructor(definition, typeArguments) {
        this.definition = types.constructDefinition(definition, typeArguments)
        this.listeners = []
    }

    broadcast(value) {
        const valueType = types.inferValueType(value)
        const sinkType = this.definition.sink.of
        if (!types.isApplicable(valueType, sinkType, this.definition.dependencies)) {
            throw exceptions.typeNotApplicable(valueType, sinkType)
        }
        for (const listener of this.listeners) {
            listener(value)
        }
    }

    connect(domain, listener) {
        const sinkType = this.definition.sink.of
        if (!types.isApplicable(sinkType, domain, this.definition.dependencies)) {
            throw exceptions.typeNotApplicable(sinkType, domain)
        }
        this.listeners.push(listener)
    }
}

module.exports = Operation
