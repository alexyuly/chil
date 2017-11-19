const Operation = require('./Operation')
const exceptions = require('../exceptions')
const { defineName, requireName, } = require('../require')
const types = require('../types')

class Component extends Operation {
    constructor(componentDefinition, componentTypeArguments) {
        super(componentDefinition, componentTypeArguments)
        this.operations = { null: this }
        // Construct operation instances from the component definition.
        for (const operationName in this.definition.operations) {
            const operationType = this.definition.operations[operationName]
            const { name, typeArguments, } = types.decompose(operationType.of)
            const operationDefinition = defineName(name, this.definition.dependencies)
            if (operationDefinition.behavior === 'operation') {
                const Class = requireName(name)
                this.operations[operationName] = new Class(operationDefinition, typeArguments)
            } else if (operationDefinition.behavior === 'component') {
                this.operations[operationName] = new Component(operationDefinition, typeArguments)
            } else {
                throw exceptions.operationBehaviorNotValid(componentDefinition.name, name)
            }
        }
        // Construct component source methods, and connect them to operation instances.
        for (const sourceName in this.definition.sources) {
            this.connectFrom(sourceName)
        }
        // Connect operation instances amongst themselves.
        for (const operationName in this.definition.operations) {
            const operation = this.operations[operationName]
            const operationType = this.definition.operations[operationName]
            for (const connectedName in operationType.to) {
                const connectedOperation = this.operations[connectedName]
                const connectedSourceName = operationType.to[connectedName]
                const listener = connectedOperation.sources[connectedSourceName]
                const listenerDomain = connectedOperation.definition.sources[connectedSourceName].of
                operation.connect(listener, listenerDomain)
            }
        }
    }

    connectFrom(sourceName) {
        const sourceType = this.definition.sources[sourceName]
        const listeners = []
        for (const connectedName in sourceType.to) {
            const connectedOperation = this.operations[connectedName]
            const connectedSourceName = sourceType.to[connectedName]
            const listener = connectedOperation.sources[connectedSourceName]
            const listenerDomain = connectedOperation.definition.sources[connectedSourceName].of
            if (!types.isApplicable(sourceType, listenerDomain, this.definition.dependencies)) {
                throw exceptions.typeNotApplicable(sourceType, listenerDomain)
            }
            listeners.push(listener)
        }
        this[sourceName] = (value) => {
            for (const listener of this.listeners) {
                listener(value)
            }
        }
    }
}

module.exports = Component
