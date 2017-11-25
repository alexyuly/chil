const Operation = require('./Operation')
const exceptions = require('../exceptions')
const { nameOf } = require('../types')
const { isGraph } = require('../utility')

class Component extends Operation {
    constructor(definition, instance, serialization) {
        super(definition, instance, serialization)
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
        if (!isGraph(value.instance.to)) {
            throw exceptions.componentValueNotValid(this.definition.name, value.instance)
        }
        for (const key in value.instance.to) {
            const connection = value.instance.to[key]
            const target = connection
                ? this.operations[key].values[connection]
                : this.operations[key]
            value.connect(target)
        }
    }

    constructOperations() {
        if (!isGraph(this.definition.operations)) {
            throw exceptions.componentTypeNotValid(this.definition.name)
        }
        this.operations = { null: this }
        for (const key in this.definition.operations) {
            const instance = this.definition.operations[key]
            const definition = this.definition.dictionary[nameOf(instance.of)]
            this.operations[key] = this.operation(definition, instance)
        }
    }

    operation(definition, instance) {
        if (isGraph(definition.operations)) {
            return new Component(definition, instance)
        }
        if (typeof definition.implementation === 'function') {
            return new definition.implementation(definition, instance)
        }
        throw exceptions.operationTypeNotValid(definition.name)
    }
}

module.exports = Component
