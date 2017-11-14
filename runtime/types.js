const {
    genericTemplateException,
    nativeTypeException,
    typeArgumentApplicationException,
    typeArgumentsException,
} = require('./exceptions')

function applies(typeArgument, typeTemplate) {
    const normalizedArgument = normalize(typeArgument)
    const normalizedTemplate = normalize(typeTemplate)
    if (normalizedTemplate === null) {
        return true
    }
    if (normalizedTemplate instanceof Array) {

    } else if (typeof normalizedTemplate === 'object') {

    } else {
        if (typeof normalizedArgument === 'object') {
            return false
        } else {

        }
    }
}

function deriveType(definition, typeArguments) {
    if (definition.generic === undefined) {
        return definition.name
    }
    if (typeof definition.generic !== 'object' || definition.generic === null) {
        throw genericTemplateException(definition.generic)
    }
    if (typeof typeArguments !== 'object' || typeArguments === null) {
        throw typeArgumentsException(typeArguments, definition.generic)
    }
    for (const key in definition.generic) {
        if (!applies(typeArguments[key], definition.generic[key])) {
            throw typeArgumentApplicationException(typeArguments[key], definition.generic[key])
        }
    }
    return {
        [definition.name]: typeArguments,
    }
}

function inferType(value) {
    const nativeType = typeof value
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return nativeType
        case 'object':
            return value === null
                ? null
                : value instanceof Array
                    ? inferTypeOfVector(value)
                    : inferTypeOfStruct(value)
        default:
            throw nativeTypeException(nativeType, value)
    }
}

function inferTypeOfStruct(object) {
    const type = {
        struct: {},
    }
    for (const key in object) {
        type.struct[key] = inferType(object[key])
    }
    return type
}

function inferTypeOfVector(array) {
    const set = {}
    for (const element of array) {
        set[pack(inferType(element))] = null
    }
    const union = []
    for (const type in set) {
        union.push(unpack(type))
    }
    return {
        vector: normalize(union),
    }
}

function normalize(type) {
    // TODO
}

function pack(type) {
    return JSON.stringify(type)
}

function unpack(type) {
    return JSON.parse(type)
}

module.exports = {
    deriveType,
    inferType,
}
