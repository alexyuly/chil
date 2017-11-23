const types = require('./types')

const excludedKeys = [
    'name',
    'abstract',
]

const extend = (definition) => {
    const abstractName = types.nameOf(definition.is)
    const abstractSpecificInstance = types.isSpecific(definition.is)
    const abstractDefinition = abstractSpecificInstance
        ? definition.dictionary[abstractName]
        : types.construct(definition.dictionary[abstractName], { of: definition.is })
    for (const key in abstractDefinition) {
        if (!excludedKeys.includes(key) && (abstractSpecificInstance || key !== 'generic')) {
            definition[key] = abstractDefinition[key]
        }
    }
}

module.exports = extend
