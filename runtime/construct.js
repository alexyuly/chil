const exceptions = require('./exceptions')
const { assertApplicable, isSpecific, parametersOf } = require('./types')
const { isGraph, replace } = require('./utility')

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

module.exports = construct
