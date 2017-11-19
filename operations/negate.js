const Operation = require('../runtime/behaviors/Operation')
const { definePath } = require('../runtime/require')
const definition = definePath('./negate')

class negate extends Operation {
    constructor() {
        super(definition)
    }

    dispatch(action) {
        this.broadcast(-action)
    }
}

module.exports = negate
