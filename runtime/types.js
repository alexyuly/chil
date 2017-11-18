const fs = require('fs')
const path = require('path')
const exceptions = require('./exceptions')

const fsEncoding = 'utf8'

const isTree = (node) =>
    typeof node === 'object' && node !== null

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

const applyDefinition = (definition, typeArguments) => {
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
        if (!isApplicable(typeArguments[key], generic[key])) {
            throw exceptions.typeNotApplicable(typeArguments[key], generic[key])
        }
    }
    return template(definition, typeArguments, {})
}

const normalize = (type) => {
    if (isTree(type)) {
        // TODO
    }
    if (typeof type === 'string' || type === null) {
        return type
    }
    throw exceptions.typeNotValid(type)
}

const inferType = (value) => {
    const nativeType = typeof value
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return nativeType
        case 'object': {
            if (value instanceof Array) {
                if (!isTree(value) || !(value instanceof Array)) {
                    throw exceptions.valueNotApplicable(value, 'vector')
                }
                const type = { 'vector': [], }
                const typeSet = {}
                for (const element of value) {
                    typeSet[JSON.stringify(inferType(element))] = null
                }
                for (const serializedType in typeSet) {
                    type.vector.push(JSON.parse(serializedType))
                }
                return normalize(type)
            }
            if (value !== null) {
                if (!isTree(value) || value instanceof Array) {
                    throw exceptions.valueNotApplicable(value, 'struct')
                }
                const type = { 'struct': {}, }
                for (const key in value) {
                    type.struct[key] = inferType(value[key])
                }
                return normalize(type)
            }
            return null
        }
        default:
            throw exceptions.nativeTypeNotValid(nativeType)
    }
}

const requireDefinition = (pathToFile) =>
    new Promise((resolve, reject) => {
        fs.readFile(
            path.resolve(pathToFile),
            fsEncoding,
            (error, file) => {
                if (file) {
                    resolve(JSON.parse(file))
                } else {
                    reject(error)
                }
            }
        )
    })

module.exports = {
    applyDefinition,
    inferType,
    isApplicable,
    requireDefinition,
    template,
}
