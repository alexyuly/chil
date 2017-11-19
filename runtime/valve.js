const Operation = require('./behaviors/Operation')

const valve = (next) => class extends Operation {
    constructor(definition, typeArguments) {
        super(definition, typeArguments, {
            control: (state) => {
                this.state = state
                while (this.queue.length > 0) {
                    next(this.push, this.state, this.queue.shift())
                }
            },
            dispatch: (action) => {
                if (this.state === undefined) {
                    this.queue.push(action)
                } else {
                    next(this.push, this.state, action)
                }
            },
        })
        this.queue = []
    }
}

module.exports = valve
