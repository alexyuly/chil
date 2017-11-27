const Operation = require('./Operation')
const exception = require('../exception')
const { nameOf } = require('../type')
const { isGraph } = require('../utility')

class Component extends Operation {
    constructor(definition, instance, serialization) {
        super(definition, instance, serialization)
        this.constructValues()
        this.constructOperations()
        this.connectValues(this.values)
        this.connectValues(this.operations)
    }

    connectValues(values) {
        for (const key in values) {
            const value = values[key]
            if (!isGraph(value.instance.to)) {
                throw exception.componentValueNotConnected(this.definition, key)
            }
            for (const connectedKey in value.instance.to) {
                const connection = value.instance.to[connectedKey]
                const target = connection
                    ? this.operations[connectedKey].values[connection]
                    : this.operations[connectedKey]
                value.connect(target)
            }
        }
    }

    constructOperations() {
        if (!isGraph(this.definition.operations)) {
            throw exception.definitionNotValid(this.definition)
        }
        this.operations = { [this.definition.name]: this }
        for (const key in this.definition.operations) {
            const instance = this.definition.operations[key]
            const definition = this.definition.dependencies[nameOf(instance.of)]
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
        throw exception.definitionNotValid(definition)
    }
}

module.exports = Component
