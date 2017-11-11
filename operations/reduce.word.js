const operation = require('../runtime/behaviors/Operation')
const typeCompose = require('../runtime/typeCompose')
const typeDefine = require('../runtime/typeDefine')

const type = typeDefine('reduce')

module.exports =
    class reduce extends operation {
        constructor(subtype) {
            super(type, typeCompose(subtype.super, subtype.parameters))
        }
    }
