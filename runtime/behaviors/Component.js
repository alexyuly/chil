const assert = require('assert')
const Operation = require('./Operation')
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
            assert(
                isGraph(value.instance.to),
                `cannot connect value ${key} for component of ${this.definition.name}: no connections specified`
            )
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
        assert(
            isGraph(this.definition.operations),
            `cannot construct operations for component of ${this.definition.name} from ${JSON.stringify(this.definition.operations)}`
        )
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
        throw new Error(`cannot construct operation of ${definition.name} for component of ${this.definition.name}`)
    }
}

module.exports = Component
