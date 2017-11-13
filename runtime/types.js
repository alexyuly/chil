const exceptions = require('./exceptions');

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
                    ? inferVectorType(value)
                    : inferStructType(value)
        default:
            throw exceptions.nativeType(nativeType, value)
    }
}

function inferStructType(object) {
    const type = {
        struct: {}
    }
    for (const key in object) {
        type.struct[key] = inferType(object[key])
    }
    return type
}

function inferVectorType(array) {
    const set = {}
    for (const element of array) {
        set[pack(inferType(element))] = null
    }
    const union = []
    for (const type in set) {
        union.push(unpack(type))
    }
    return {
        vector: union.length === 0
            ? null
            : union.length === 1
                ? union[0]
                : union
    }
}

function pack(type) {
    return JSON.stringify(type)
}

function unpack(type) {
    return JSON.parse(type)
}

module.exports = {
    infer: inferType,
}
