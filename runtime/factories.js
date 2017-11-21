const Operation = require('./behaviors/Operation')

const pipe = (reducer) => class extends Operation {
    constructor(definition, typeArgs) {
        super(definition, typeArgs)
        this.constructValues({
            feed: (action) => {
                reducer(action, this.next)
            },
        })
    }
}

const valve = (reducer) => class extends Operation {
    constructor(definition, typeArgs) {
        super(definition, typeArgs)
        this.queue = []
        this.constructValues({
            seed: (state) => {
                this.state = state
                while (this.queue.length > 0) {
                    reducer(this.queue.shift(), this.state, this.next)
                }
            },
            feed: (action) => {
                if (this.state === undefined) {
                    this.queue.push(action)
                } else {
                    reducer(action, this.state, this.next)
                }
            },
        })
    }
}

module.exports = {
    pipe,
    valve,
}
