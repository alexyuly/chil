const operation = require('../engine/operation')
const typeDefine = require('../engine/typeDefine')

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
