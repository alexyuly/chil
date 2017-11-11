const types = require('../types');

module.exports =
    class Value {
        constructor(value) {
            this.value = value
            this.type = new.target === Value
                ? types.infer(value)
                : value
        }
    }
