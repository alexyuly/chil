const types = require('../types')

class Value {
    constructor(value) {
        this.type = types.inferType(value)
        this.value = value
    }
}

module.exports = Value
