const operation = require('../engine/operation')
const typeCompose = require('../engine/typeCompose')
const typeDefine = require('../engine/typeDefine')

const type = typeDefine('map')

module.exports =
    class map extends operation {
        constructor(subtype) {
            super(type, typeCompose(subtype.super, subtype.parameters))
        }
    }
