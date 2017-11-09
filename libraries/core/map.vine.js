const operation = require('../../engine/operation')
const typeCompose = require('../../engine/typeCompose')
const typeDefine = require('../../engine/typeDefine')

const type = typeDefine('map')

module.exports =
    class map extends operation {
        constructor(subtype) {
            if (new.target === Map) {
                throw new Error('Map is an abstract class')
            }
            super(type, typeCompose(subtype.supertype, subtype.parameters))
        }
    }
