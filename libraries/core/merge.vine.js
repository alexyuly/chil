const map = require('./map.vine')
const typeDefine = require('../../engine/typeDefine')

const type = typeDefine('merge')

module.exports =
    class merge extends map {
        constructor() {
            super(type)
        }
        feed() {
            this.broadcast(this.sources.feed.pop())
        }
    }
