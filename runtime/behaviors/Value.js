const { inferType } = require('../types')

class Value {
    constructor(x) {
        if (new.target === Value) {
            this.value = x
            this.type = inferType(x)
        } else {
            this.type = x
        }
    }
}

module.exports = Value
