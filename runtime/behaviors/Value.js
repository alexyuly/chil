const exceptions = require('../exceptions')
const types = require('../types')

class Value {
    constructor(definition, typeArguments) {
        this.definition = types.constructDefinition(definition, typeArguments)
        this.typeArguments = typeArguments
        this.listeners = []
    }

    connect(value) {
        if (!types.isApplicable(this.definition.of, value.definition.of)) {
            throw exceptions.typeNotApplicable(this.definition.of, value.definition.of)
        }
        this.listeners.push(value)
    }

    next(event) {
        const valueType = types.inferValueType(event)
        if (!types.isApplicable(valueType, this.definition.of)) {
            throw exceptions.typeNotApplicable(valueType, this.definition.of)
        }
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Value
