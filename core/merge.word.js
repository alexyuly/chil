const typeClass = require('../engine/typeClass')
const typeDefine = require('../engine/typeDefine')
const typeInstance = require('../engine/typeInstance')

const type = typeDefine('merge')
const superclass = typeClass(type.superclass)

module.exports =
    class merge extends superclass {
        constructor(args) {
            super(typeInstance(type, args))
        }
        feed() {
            this.broadcast(this.sources.feed.pop())
        }
    }
