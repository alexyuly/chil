const Operation = require('./Operation')
const exceptions = require('../exceptions')
const types = require('../types')

class Component extends Operation {
    constructor(definition, instance, typeArgs) {
        super(definition, instance, typeArgs)
        this.constructValues()
        this.constructOperations()
        for (const value of this.values) {
            this.connectValue(value)
        }
        for (const operation of this.operations) {
            this.connectValue(operation)
        }
    }

    connectValue(value) {
        for (const name in value.instance.to) {
            value.connect(this.operations[name].values[value.instance.to[name]])
        }
    }

    constructOperations() {
        this.operations = { null: this }
        for (const name in this.definition.operations) {
            const instance = this.definition.operations[name]
            const type = types.decompose(instance.of)
            const definition = this.definition.dictionary[type.name]
            if (definition.dictionary) {
                this.operations[name] = new Component(definition, instance, type.args)
            } else if (definition.implementation) {
                const OperationClass = definition.implementation
                this.operations[name] = new OperationClass(definition, instance, type.args)
            } else {
                throw exceptions.operationTypeNotValid(definition.name)
            }
        }
    }
}

module.exports = Component
