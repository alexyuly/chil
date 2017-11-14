const { inferType } = require('../types')

class Value {
    constructor(value) {
        this.value = value
        this.type = new.target === Value
            ? inferType(value)
            : value
    }
}

module.exports = Value
