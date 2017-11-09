const typeCompose = require('./typeCompose')
const typeOf = require('./typeOf')
const typeEqual = require('./typeEqual')

module.exports =
    class operation {
        constructor(type, parameters) {
            if (new.target === operation) {
                throw new Error('Operation is an abstract class')
            }
            this.sinks = []
            this.sources = {}
            this.type = type
            const keys = Object.keys(this.type.sources)
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i]
                this.sources[key] = this.source(key)
                if (parameters) {
                    this.type.sources[key].of = typeCompose(
                        this.type.sources[key].of,
                        parameters,
                    )
                }
            }
        }
        broadcast(event) {
            if (event === undefined) {
                return
            }
            if (!typeEqual(this.type.sink.of, typeOf(event))) {
                throw new Error('Operation sink type does not match event type')
            }
            for (const sink of this.sinks) {
                sink.push(event)
            }
        }
        sink(source) {
            if (!typeEqual(this.type.sink.of, source.type)) {
                throw new Error('Operation sink type does not match source type')
            }
            this.sinks.push(source)
        }
        source(key) {
            const events = []
            return {
                push: (event) => {
                    events.push(event)
                    this[key]()
                },
                pop: () => events.pop(),
                shift: () => events.shift(),
                type: () => this.type.sources[key].of
            }
        }
    }
