const graph = require('./graph')

const reservedKeys = [
    'dictionary',
    'implementation',
]

const replace = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (reservedKeys.includes(key)) {
            output[key] = input[key]
        } else if (graph(node)) {
            output[key] = replace(
                node,
                parameters,
                node instanceof Array
                    ? []
                    : {}
            )
        } else if (typeof node === 'string') {
            for (const alias in parameters) {
                if (node === alias) {
                    output[key] = parameters[alias]
                    break
                }
            }
        } else {
            output[key] = null
        }
    }
    return output
}

module.exports = replace
