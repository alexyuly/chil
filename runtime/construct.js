const exceptions = require('./exceptions')
const { assertApplicable, isSpecific, parametersOf } = require('./types')
const { isGraph } = require('./utility')

const reservedKeys = [
    'dictionary',
    'implementation',
]

const replace = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (reservedKeys.includes(key)) {
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

const construct = (definition, instance) => {
    const genericDefinition = isGraph(definition.parameters)
    const specificInstance = isSpecific(instance.of)
    if ((specificInstance && genericDefinition) || (!specificInstance && !genericDefinition)) {
        throw exceptions.instanceNotApplicable(instance.of, definition.name)
    }
    if (specificInstance) {
        return definition
    }
    definition.parameters = replace(definition.parameters)
    const parameters = parametersOf(instance.of)
    for (const key in definition.parameters) {
        assertApplicable(parameters[key], definition.parameters[key])
    }
    return replace(definition, parameters, {})
}

module.exports = {
    construct,
    replace,
}
