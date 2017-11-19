const Operation = require('../runtime/behaviors/Operation')
const { definePath } = require('../runtime/require')
const definition = definePath('./invert')

class invert extends Operation {
    constructor() {
        super(definition)
    }

    dispatch(action) {
        this.broadcast(1 / action)
    }
}

module.exports = invert
