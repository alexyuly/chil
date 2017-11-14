const Value = require('./Value')
const { deriveType } = require('../types')

class Operation extends Value {
    constructor(definition, typeArguments) {
        super(deriveType(definition, typeArguments))
    }
}

module.exports = Operation
