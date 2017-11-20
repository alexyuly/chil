const Operation = require('./behaviors/Operation')

const pipe = (reducer) => class extends Operation {
    constructor(definition, typeArguments) {
        super(definition, typeArguments)
        this.constructValues((next) => ({
            dispatch: (action) => {
                reducer(next, action)
            },
        }))
    }
}

module.exports = pipe
