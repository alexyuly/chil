const isGraph = (node) => typeof node === 'object' && node !== null

const replace = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (key === 'dependencies') {
            output[key] = input[key]
        } else if (isGraph(node)) {
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

module.exports = {
    isGraph,
    replace,
}
