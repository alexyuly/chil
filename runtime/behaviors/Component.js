const Operation = require('./Operation')
const exceptions = require('../exceptions')
const types = require('../types')
const { defineName, requireName, } = require('../require')

class Component extends Operation {
    constructor(...args) {
        super(...args)
        this.operations = { null: this, }
        for (const name in this.definition.operations) {
            const instance = this.definition.operations[name]
            const { typeName, typeArguments, } = types.decompose(instance.of)
            const definition = defineName(typeName, this.definition.dependencies)
            if (definition.behavior === 'operation') {
                const OperationClass = requireName(typeName)
                this.operations[name] = new OperationClass(definition, typeArguments)
            } else if (definition.behavior === 'component') {
                this.operations[name] = new Component(definition, typeArguments)
            } else {
                throw exceptions.componentHierarchyNotValid(this.definition.name, typeName)
            }
        }
        this.constructValues(this.delegate)
        for (const value of this.values) {
            this.connectValue(value, value.definition.to)
        }
        for (const operationName in this.definition.operations) {
            const operationDefinition = this.definition.operations[operationName]
            this.connectValue(this.operations[operationName], operationDefinition.to)
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
