const exceptions = require('./exceptions')

const reservedKeys = [
    'dictionary',
    'implementation',
]

const compareEvents = (a, b) => {
    const nativeType = typeof a
    if (nativeType !== typeof b) {
        return false
    }
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return a === b
        case 'object':
        case 'undefined': {
            if (!a || !b) {
                return a === b
            }
            for (const key in a) {
                if (!compareEvents(a[key], b[key])) {
                    return false
                }
            }
            return true
        }
        default:
            throw exceptions.eventNotValid(a)
    }
}

const isGraph = (node) => typeof node === 'object' && node !== null
const isSpecific = (type) => typeof type === 'string'

const parametersOf = (instance) => {
    if (isGraph(instance.of)) {
        for (const key in instance.of) {
            return instance.of[key]
        }
    }
    return undefined
}

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

const assertApplicable = (type, domain) => {
    const isNotApplicable = () => {
        // TODO
    }
    if (isNotApplicable(type, domain)) {
        throw exceptions.typeNotApplicable(type, domain)
    }
}

const construct = (definition, instance) => {
    const genericDefinition = isGraph(definition.generic)
    const specificInstance = isSpecific(instance.of)
    if ((specificInstance && genericDefinition) || (!specificInstance && !genericDefinition)) {
        throw exceptions.instanceNotApplicable(instance.of, definition.name)
    }
    if (specificInstance) {
        return definition
    }
    definition.generic = replace(definition.generic)
    const parameters = parametersOf(instance)
    for (const key in definition.generic) {
        assertApplicable(parameters[key], definition.generic[key])
    }
    return replace(definition, parameters, {})
}

const nameOf = (instance) => {
    if (isSpecific(instance.of)) {
        return instance.of
    }
    if (isGraph(instance.of)) {
        for (const key in instance.of) {
            return key
        }
    }
    throw exceptions.typeNotValid(instance.of)
}

const typeOf = (event) => {
    const nativeType = typeof event
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return nativeType
        case 'object':
        case 'undefined': {
            if (event instanceof Array) {
                const type = { vector: [] }
                const typeSet = {}
                for (const element of event) {
                    typeSet[JSON.stringify(typeOf(element))] = null
                }
                for (const typeHash in typeSet) {
                    type.vector.push(JSON.parse(typeHash))
                }
                return type
            }
            if (event) {
                const type = { struct: {} }
                for (const key in event) {
                    type.struct[key] = typeOf(event[key])
                }
                return type
            }
            return null
        }
        default:
            throw exceptions.eventNotValid(event)
    }
}

module.exports = {
    assertApplicable,
    compareEvents,
    construct,
    isGraph,
    isSpecific,
    nameOf,
    parametersOf,
    replace,
    typeOf,
}
