const operation = require('../runtime/behaviors/Operation')
const typeCompose = require('../runtime/typeCompose')
const typeDefine = require('../runtime/typeDefine')

const type = typeDefine('map')

module.exports =
    class map extends operation {
        constructor(subtype) {
            super(type, typeCompose(subtype.super, subtype.parameters))
        }
    }
