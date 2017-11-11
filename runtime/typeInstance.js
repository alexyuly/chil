const instanceOf = require('./instanceOf')

module.exports =
    function typeInstance(type, args) {
        const keys = Object.keys(type.parameters)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const arg = args[key]
            const parameter = type.parameters[key]
            if (!instanceOf(arg, parameter)) {
                throw new Error(`merge parameter ${key} expected type ${parameter} but got ${arg}`)
            }
        }
        return Object.assign({}, type, { parameters: args })
    }
