const assert = require('assert')
const Stream = require('./Stream')
const { construct } = require('../type')
const { isGraph } = require('../utility')

class Operation extends Stream {
    constructor(definition, instance = { of: definition.name }, serialization) {
        super(instance, serialization)
        this.definition = construct(definition, instance.of)
    }

    constructStreams(delegates = {}) {
        assert(
            isGraph(this.definition.streams),
            `cannot construct streams for operation of ${this.definition.name} from ${JSON.stringify(this.definition.streams)}`
        )
        this.streams = {}
        for (const key in this.definition.streams) {
            const instance = this.definition.streams[key]
            this.streams[key] = this.stream(instance, delegates[key])
        }
    }

    stream(instance, delegate) {
        if (!delegate) {
            return new Stream(instance)
        }
        const StreamClass = class extends Stream {
            next(event) {
                delegate(event)
            }
        }
        return new StreamClass(instance)
    }
}

module.exports = Operation
