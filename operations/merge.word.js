const typeClass = require('../runtime/typeClass')
const typeDefine = require('../runtime/typeDefine')
const typeInstance = require('../runtime/typeInstance')

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
