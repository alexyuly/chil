const Operation = require('./Operation')

class Component extends Operation {
    constructor(definition, typeArguments) {
        super(definition, typeArguments)
    }
}

module.exports = Component
