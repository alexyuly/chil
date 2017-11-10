const operation = require('../engine/operation')
const typeCompose = require('../engine/typeCompose')
const typeDefine = require('../engine/typeDefine')

const type = typeDefine('reduce')

module.exports =
    class reduce extends operation {
        constructor(subtype) {
            super(type, typeCompose(subtype.super, subtype.parameters))
        }
    }
