const instanceOf = require('./instanceOf')
const typeClass = require('./typeClass')
const typeCompose = require('./typeCompose')
const typeOf = require('./typeOf')

module.exports =
    class operation {
        constructor(type, parameters) {
            if (new.target === operation || (type.abstract && new.target === typeClass(type.class))) {
                throw new Error('cannot construct instance of abstract type')
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
            if (!instanceOf(typeOf(event), this.type.sink.of)) {
                throw new Error('operation sink type does not match event type')
            }
            for (const sink of this.sinks) {
                sink.push(event)
            }
        }
        sink(source) {
            if (!instanceOf(this.type.sink.of, source.type)) {
                throw new Error('operation sink type does not match source type')
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
                dump: () => events.splice(0),
                type: () => this.type.sources[key].of
            }
        }
    }
