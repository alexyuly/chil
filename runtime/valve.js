const Operation = require('./behaviors/Operation')

const valve = (reducer) => class extends Operation {
    constructor(definition, typeArguments) {
        super(definition, typeArguments)
        this.queue = []
        this.constructValues((next) => ({
            control: (state) => {
                this.state = state
                while (this.queue.length > 0) {
                    reducer(next, this.state, this.queue.shift())
                }
            },
            dispatch: (action) => {
                if (this.state === undefined) {
                    this.queue.push(action)
                } else {
                    reducer(next, this.state, action)
                }
            },
        }))
    }
}

module.exports = valve
