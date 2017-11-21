const exceptions = require('./exceptions')

const isTree = (node) => typeof node === 'object' && node !== null

const template = (tree, spec = {}, initial = spec) =>
    Object.keys(tree).reduce(
        (next, key) => {
            const node = tree[key]
            if (isTree(node)) {
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

const construct = (definition, typeArgs) => {
    if (definition.generic === undefined) {
        if (typeArgs === undefined) {
            return definition
        }
        throw exceptions.typeArgumentsNotExpected(definition.name)
    }
    if (!isTree(definition.generic)) {
        throw exceptions.typeGenericNotValid(definition.name)
    }
    if (!isTree(typeArgs)) {
        throw exceptions.typeArgumentsNotValid(definition.name)
    }
    const generic = template(definition.generic)
    for (const key in generic) {
        if (!isApplicable(typeArgs[key], generic[key], definition.dependencies)) {
            throw exceptions.typeNotApplicable(typeArgs[key], generic[key])
        }
    }
    return template(definition, typeArgs, {})
}

const normalize = (valueType) => {
    if (isTree(valueType)) {
        // TODO
    }
    if (typeof valueType === 'string' || valueType === null) {
        return valueType
    }
    throw exceptions.typeNotValid(valueType)
}

const decompose = (type) => {
    if (isTree(type)) {
        for (const name in type) {
            return {
                name,
                args: type[name],
            }
        }
    }
    if (typeof type === 'string' || type === null) {
        return {
            name: type,
        }
    }
    throw exceptions.typeNotValid(type)
}

const inferValueType = (event) => {
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
                    valueTypeSet[JSON.stringify(inferValueType(element))] = null
                }
                for (const serializedValueType in valueTypeSet) {
                    valueType.vector.push(JSON.parse(serializedValueType))
                }
                return normalize(valueType)
            }
            if (event !== null) {
                const valueType = { struct: {} }
                for (const key in event) {
                    valueType.struct[key] = inferValueType(event[key])
                }
                return normalize(valueType)
            }
            return null
        }
        default:
            throw exceptions.nativeTypeNotValid(nativeType)
    }
}

const testEventEquality = (a, b) => {
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
                if (!testEventEquality(a[key], b[key])) {
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
    decompose,
    inferValueType,
    isApplicable,
    template,
    testEventEquality,
}
