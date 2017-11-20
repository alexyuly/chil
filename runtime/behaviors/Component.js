const Operation = require('./Operation')
const exceptions = require('../exceptions')
const types = require('../types')
const { defineName, requireName, } = require('../require')

class Component extends Operation {
    constructor(...args) {
        super(...args)
        this.operations = { null: this, }
        for (const operationName in this.definition.operations) {
            const operationDefinition = this.definition.operations[operationName]
            const { name, typeArguments, } = types.decompose(operationDefinition.of)
            const definition = defineName(name, this.definition.dependencies)
            if (definition.behavior === 'operation') {
                const OperationClass = requireName(name)
                this.operations[operationName] = new OperationClass(definition, typeArguments)
            } else if (definition.behavior === 'component') {
                this.operations[operationName] = new Component(definition, typeArguments)
            } else {
                throw exceptions.operationBehaviorNotValid(this.definition.name, name)
            }
        }
        this.constructValues(this.delegate)
        for (const value of this.values) {
            this.connectValue(value, value.definition.to)
        }
        for (const operationName in this.definition.operations) {
            const operationDefinition = this.definition.operations[operationName]
            const operation = this.operations[operationName]
            this.connectValue(operation, operationDefinition.to)
        }
    }

    connectValue(value, targets) {
        for (const name in targets) {
            value.connect(this.operations[name].values[targets[name]])
        }
    }

    delegate(next) {
        const delegates = {}
        for (const name in this.definition.values) {
            delegates[name] = next
        }
    }
}

module.exports = Component
