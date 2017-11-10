const operation = require('../engine/operation')
const typeDefine = require('../engine/typeDefine')

const type = typeDefine('event')

module.exports =
    class event extends operation {
        constructor(parameters) {
            super(type)
            this.value = parameters.value
        }
        run() {
            this.broadcast(this.value)
        }
    }
