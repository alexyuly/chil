const assert = require('assert')
const Operation = require('./Operation')
const { nameOf } = require('../type')
const { isGraph } = require('../utility')

class Component extends Operation {
    constructor(definition, instance, serialization) {
        super(definition, instance, serialization)
        this.constructStreams()
        this.constructOperations()
        this.connectStreams(this.streams)
        this.connectStreams(this.operations)
    }

    connectStreams(streams) {
        for (const key in streams) {
            const stream = streams[key]
            assert(
                isGraph(stream.instance.to),
                `cannot connect stream ${key} for component of ${this.definition.name}: no connections specified`
            )
            for (const connectedKey in stream.instance.to) {
                const connection = stream.instance.to[connectedKey]
                const target = connection
                    ? this.operations[connectedKey].streams[connection]
                    : this.operations[connectedKey]
                stream.connect(target)
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
