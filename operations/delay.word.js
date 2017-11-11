const operation = require('../runtime/behaviors/Operation')
const typeDefine = require('../runtime/typeDefine')

const type = typeDefine('delay')

module.exports =
    class delay extends operation {
        constructor() {
            super(type)
        }
        feed() {
            setTimeout(
                () => this.broadcast(null),
                this.sources.feed.pop(),
            )
        }
    }
