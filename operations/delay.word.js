const Operation = require('../runtime/behaviors/Operation')

class Delay extends Operation {
    constructor() {
        super('delay')
    }
    feed() {
        setTimeout(
            () => this.broadcast(null),
            this.sources.feed.pop(),
        )
    }
}

module.exports = Delay
