const assert = require('assert')
const Serializable = require('../serialization/Serializable')
const { isApplicableStream } = require('../type')
const { typeOf } = require('../event')

class Stream extends Serializable {
    constructor(instance = {}, serialization) {
        super(serialization)
        this.instance = instance
        this.listeners = []
    }

    connect(stream) {
        assert(
            isApplicableStream(this.instance.of, stream.instance.of),
            `cannot connect stream of ${JSON.stringify(this.instance.of)} to stream of ${JSON.stringify(stream.instance.of)}`
        )
        this.listeners.push(stream)
    }

    next(event) {
        assert(
            isApplicableStream(typeOf(event), this.instance.of),
            `cannot apply event ${JSON.stringify(event)} to stream of ${JSON.stringify(this.instance.of)}`
        )
        for (const listener of this.listeners) {
            listener.next(event)
        }
    }
}

module.exports = Stream
