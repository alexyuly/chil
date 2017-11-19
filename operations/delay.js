const Operation = require('../runtime/behaviors/Operation')
const { definePath } = require('../runtime/require')
const definition = definePath('./delay')

class delay extends Operation {
    constructor() {
        super(definition)
    }

    control(state) {
        this.state = state
    }

    dispatch(action) {
        if (this.state !== undefined) {
            setTimeout(() => this.broadcast(action), this.state)
        }
    }
}

module.exports = delay
