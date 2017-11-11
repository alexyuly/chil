const typeClass = require('../runtime/typeClass')
const typeDefine = require('../runtime/typeDefine')
const typeInstance = require('../runtime/typeInstance')

const type = typeDefine('store')
const superclass = typeClass(type.superclass)

module.exports =
    class store extends superclass {
        constructor(args) {
            super(typeInstance(type, args))
        }
        feed() {
            const state = this.sources.seed.dump().pop()
            if (state !== undefined) {
                this.sources.feed.pop()
                this.broadcast(state)
            }
        }
        seed() {
            if (!this.started) {
                const actions = this.sources.feed.dump()
                if (actions.length > 0) {
                    this.broadcast(this.sources.seed.pop())
                }
                this.started = true
            }
        }
    }
