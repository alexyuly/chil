const exceptions = require('./exceptions')

const isGraph = (node) => typeof node === 'object' && node !== null

const template = (tree, spec = {}, initial = spec) =>
    Object.keys(tree).reduce(
        (next, key) => {
            const node = tree[key]
            if (isGraph(node)) {
                next[key] = template(
                    node,
                    spec,
                    node instanceof Array
                        ? []
                        : {}
                )
            } else if (typeof node === 'string') {
                for (const specKey in spec) {
                    if (node === specKey) {
                        next[key] = spec[specKey]
                        break
                    }
                }
            } else if (node === null) {
                next[key] = node
            } else {
                throw exceptions.typeNotValid(node)
            }
            return next
        },
        initial
    )

const isApplicable = () => {
    // TODO
}

const construct = () => {
    // TODO
}

const normalize = (valueType) => {
    if (isGraph(valueType)) {
        // TODO
    }
    if (typeof valueType === 'string' || valueType === null) {
        return valueType
    }
    throw exceptions.typeNotValid(valueType)
}

const name = (instance) => {
    if (isGraph(instance.of)) {
        for (const key in instance.of) {
            return key
        }
    }
    if (typeof instance.of === 'string' || instance.of === null) {
        return instance.of
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
        case 'object': {
            if (event instanceof Array) {
                const valueType = { vector: [] }
                const valueTypeSet = {}
                for (const element of event) {
                    valueTypeSet[JSON.stringify(typeOf(element))] = null
                }
                for (const serializedValueType in valueTypeSet) {
                    valueType.vector.push(JSON.parse(serializedValueType))
                }
                return normalize(valueType)
            }
            if (event !== null) {
                const valueType = { struct: {} }
                for (const key in event) {
                    valueType.struct[key] = typeOf(event[key])
                }
                return normalize(valueType)
            }
            return null
        }
        default:
            throw exceptions.nativeTypeNotValid(nativeType)
    }
}

const isEqual = (a, b) => {
    const nativeType = typeof a
    if (nativeType !== typeof b) {
        return false
    }
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return a === b
        case 'object': {
            if (a === null) {
                return b === null
            }
            for (const key in a) {
                if (!isEqual(a[key], b[key])) {
                    return false
                }
            }
            return true
        }
        default:
            throw exceptions.nativeTypeNotValid(nativeType)
    }
}

module.exports = {
    construct,
    isApplicable,
    isEqual,
    isGraph,
    name,
    template,
    typeOf,
}
