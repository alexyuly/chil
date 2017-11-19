const Operation = require('./Operation')
const exceptions = require('../exceptions')
const { defineName, requireName, } = require('../require')
const types = require('../types')

class Component extends Operation {
    constructor(definition, componentTypeArguments) {
        super(definition, componentTypeArguments)
        this.operations = {}
        for (const operationName in this.definition.operations) {
            const operationType = this.definition.operations[operationName]
            const { name, typeArguments, } = types.decompose(operationType.of)
            const operationDefinition = defineName(name, this.definition.dependencies)
            if (operationDefinition.operation === null) {
                const implementation = requireName(name)
                this.operations[operationName] = new implementation(typeArguments)
            } else if (operationDefinition.component === null) {
                this.operations[operationName] = new Component(operationDefinition, typeArguments)
            } else {
                throw exceptions.operationNotValid(definition.name, operationName)
            }
        }
        for (const sourceName in this.definition.sources) {
            const source = this.definition.sources[sourceName]
            this[sourceName] = function(event) {
                for (const operationName in source.to) {
                    this.operations[operationName][source.to[operationName]](event)
                }
            }
        }
        for (const operationName in this.operations) {
            const operationType = this.definition.operations[operationName]
            for (const connectedName in operationType.to) {
                const operation = this.operations[operationName]
                const connectedOperation = this.operations[connectedName]
                const connectedSourceName = operationType.to[connectedName]
                const domain = connectedOperation.definition.sources[connectedSourceName].of
                const listener = connectedOperation[connectedSourceName].bind(connectedOperation)
                operation.connect(domain, listener)
            }
        }
    }
}

module.exports = Component
