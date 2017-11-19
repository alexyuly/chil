const Operation = require('./behaviors/Operation')

const reducerClass = (definition, reducer) => class extends Operation {
    constructor(typeArguments) {
        super(definition, typeArguments)
        this.queue = []
    }

    control(state) {
        this.state = state
        while (this.queue.length > 0) {
            this.broadcast(reducer(this.state, this.queue.shift()))
        }
    }

    dispatch(action) {
        if (this.state === undefined) {
            this.queue.push(action)
        } else {
            this.broadcast(reducer(this.state, action))
        }
    }
}

module.exports = reducerClass
