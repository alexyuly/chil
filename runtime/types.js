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

const constructDefinition = (definition, typeArguments) => {
    // TODO - resolve dependency definitions
    if (definition.generic === undefined) {
        if (typeArguments === undefined) {
            return definition
        }
        throw exceptions.definitionArgumentsNotExpected(definition.name)
    }
    if (!isTree(definition.generic)) {
        throw exceptions.definitionGenericNotValid(definition.name)
    }
    if (!isTree(typeArguments)) {
        throw exceptions.definitionArgumentsNotValid(definition.name)
    }
    const generic = template(definition.generic)
    for (const key in generic) {
        if (!isApplicable(typeArguments[key], generic[key], definition.dependencies)) {
            throw exceptions.typeNotApplicable(typeArguments[key], generic[key])
        }
    }
    return template(definition, typeArguments, {})
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
        for (const typeName in type) {
            return {
                typeName,
                typeArguments: type[typeName],
            }
        }
    }
    if (typeof type === 'string' || type === null) {
        return {
            typeName: type,
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
                const valueType = { vector: [], }
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
                const valueType = { struct: {}, }
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

module.exports = {
    constructDefinition,
    decompose,
    inferValueType,
    isApplicable,
    template,
}
