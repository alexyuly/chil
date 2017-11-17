const fs = require('fs')
const path = require('path')
const exceptions = require('./exceptions')

const fsOptions = { encoding: 'utf8' }

function applies(type, domain) {
    // TODO
}

function definePath(pathToFile) {
    return new Promise(function (resolve, reject) {
        let fsPath
        try {
            fsPath = path.resolve(pathToFile)
        } catch (error) {
            reject(exceptions.definitionPath(name, pathToFile))
            return
        }
        fs.readFile(
            fsPath,
            fsOptions,
            function (error, file) {
                if (file) {
                    let definition
                    try {
                        definition = JSON.parse(file)
                    } catch {
                        reject(exceptions.definitionParse(name, pathToFile))
                        return
                    }
                    resolve(definition)
                } else {
                    reject(exceptions.definitionPath(name, pathToFile))
                }
            }
        )
    })
}

function deriveDefinition(definition, typeArguments) {
    // TODO
}

function deriveType(definition, typeArguments) {
    if (definition.generic === undefined) {
        return definition.name
    }
    if (typeof definition.generic !== 'object' || definition.generic === null) {
        throw exceptions.genericTemplateFormat(definition.generic)
    }
    if (typeof typeArguments !== 'object' || typeArguments === null) {
        throw exceptions.typeArgumentFormat(typeArguments)
    }
    for (const key in definition.generic) {
        if (!applies(typeArguments[key], definition.generic[key])) {
            throw exceptions.typeArgumentApplication(typeArguments[key], definition.generic[key])
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
            throw exceptions.nativeType(nativeType, value)
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
    applies,
    definePath,
    deriveDefinition,
    deriveType,
    inferType,
}
