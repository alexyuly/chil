const Operation = require('./behaviors/Operation')

const pipe = (next) => class extends Operation {
    constructor(definition, typeArguments) {
        super(definition, typeArguments, {
            dispatch: (action) => {
                next(this.push, action)
            },
        })
        this.queue = []
    }
}

module.exports = pipe
