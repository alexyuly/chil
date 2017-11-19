const exceptions = require('../exceptions')
const types = require('../types')

class Source {
    constructor(definition, typeArguments) {
        this.definition = types.constructDefinition(definition, typeArguments)
        this.listeners = []
    }

    connect(listener, listenerDomain) {
        if (!types.isApplicable(this.definition.of, listenerDomain, this.definition.dependencies)) {
            throw exceptions.typeNotApplicable(this.definition.of, listenerDomain)
        }
        this.listeners.push(listener)
    }

    push(value) {
        const valueType = types.inferValueType(value)
        if (!types.isApplicable(valueType, this.definition.of, this.definition.dependencies)) {
            throw exceptions.typeNotApplicable(valueType, this.definition.of)
        }
        for (const listener of this.listeners) {
            listener(value)
        }
    }
}

module.exports = Source
