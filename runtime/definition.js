const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const { branch, construct } = require('./type')
const { extend, isGraph } = require('./utility')

/**
 * Assigns an operation definition's implementation class to the definition, if possible.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {string} path - a path to the operation definition
 */
const requireImplementation = (definition, path) => {
    if (isGraph(definition.operations)) {
        // A definition with operations has no implementation.
        return
    }
    try {
        definition.implementation = require(path)
    } finally {
        // This definition may be abstract, so the path may not exist. If the path doesn't exist and this definition is
        // constructed by an Operation, then a definitionNotValid exception will be thrown.
    }
}

/**
 * Assigns reserved words implied by a set of value instances, to a target object.
 * @param {object} target - an object which gets mutated by this function
 * @param {object} instances - an object which maps names to value instances
 */
const reservedWordsApplyInstances = (target, instances) => {
    if (!isGraph(instances)) {
        return
    }
    for (const name in instances) {
        target[name] = null
        const value = instances[name]
        const initials = value.initial
        if (isGraph(initials)) {
            for (const key in initials) {
                target[key] = null
            }
        }
        const connections = value.to
        if (isGraph(connections)) {
            for (const key in connections) {
                target[connections[key]] = null
            }
        }
    }
}

/**
 * Reserved words are identifiers which do not reference a dependency on an operation definition.
 * Reserved words will be ignored during dependency resolution for the operation definition.
 * @param {object} definition - an operation definition
 * @returns {object} the set of reserved words implied by the definition
 */
const reservedWords = (definition) => {
    // A set of words are reserved by default.
    const set = {
        boolean: null,
        dependencies: null,
        implementation: null,
        initial: null,
        is: null,
        name: null,
        number: null,
        of: null,
        operation: null,
        operations: null,
        parameters: null,
        string: null,
        struct: null,
        to: null,
        values: null,
        vector: null,
    }
    // The name of the type definition is reserved.
    set[definition.name] = null
    // Names and paths of dependencies are reserved.
    if (isGraph(definition.dependencies)) {
        for (const name in definition.dependencies) {
            set[name] = null
            set[definition.dependencies[name]] = null
        }
    }
    // Names of type parameters are reserved.
    if (isGraph(definition.parameters)) {
        for (const name in definition.parameters) {
            set[name] = null
        }
    }
    // Names of type instances are reserved.
    reservedWordsApplyInstances(set, definition.values)
    reservedWordsApplyInstances(set, definition.operations)
    return set
}

/**
 * @param {string} word - any string
 * @param {object} reservedWordsSet - a set of reserved words returned by reservedWords
 * @returns {boolean} true if and only if the word is reserved
 */
const isReservedWord = (word, reservedWordsSet) => {
    for (const reservedWord in reservedWordsSet) {
        if (word === reservedWord) {
            return true
        }
    }
    return false
}

/**
 * Assigns the absolute path of a core dependency to an operation definition, if possible.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {object} reservedWordsSet - a set of reserved words returned by reservedWords
 * @param {string} name - possibly the name of a core dependency
 */
const resolveCoreDependency = (definition, reservedWordsSet, name) => {
    if (isReservedWord(name, reservedWordsSet)) {
        return
    }
    if (!isGraph(definition.dependencies)) {
        definition.dependencies = {}
    }
    // The dependency of [name] may exist at an absolute path within the definitions folder.
    definition.dependencies[name] = {
        absolute: resolve(__dirname, `./definitions/${name}`),
    }
}

/**
 * Assigns absolute paths of core dependencies implied by an object, to an operation definition.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {object} reservedWordsSet - a set of reserved words returned by reservedWords
 * @param {object} set - an object which is the source of implied core dependencies
 */
const resolveCoreDependencies = (definition, reservedWordsSet = reservedWords(definition), set = definition) => {
    for (const key in set) {
        const value = set[key]
        resolveCoreDependency(definition, reservedWordsSet, key)
        for (const type of value instanceof Array ? value : [ value ]) {
            branch({
                type,
                specific: () => resolveCoreDependency(definition, reservedWordsSet, type),
                generic: () => resolveCoreDependencies(definition, reservedWordsSet, type),
            })
        }
    }
}

/**
 * Extends an operation definition from its base operation definition.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {object} base - a base operation definition from which the definition will extend
 */
const extendBase = (definition, base = branch({
    type: definition.is,
    specific: () => definition.dependencies[definition.is],
    generic: () => construct(definition.dependencies[definition.is], definition.is),
})) => {
    for (const key in base) {
        if (key !== 'name' && key !== 'is') {
            extend(definition, base)
        }
    }
}

/**
 * @param {string} path - a file system path to an operation definition file, without the .yml extension specified
 * @returns {object} an operation definition based on the path
 */
const define = (path) => {
    const file = fs.readFileSync(`${path}.yml`, 'utf8')
    const definition = yaml.safeLoad(file)
    requireImplementation(definition, path)
    resolveCoreDependencies(definition)
    for (const name in definition.dependencies) {
        const dependencyPath = definition.dependencies[name]
        definition.dependencies[name] = define(dependencyPath.absolute || resolve(parse(path).dir, dependencyPath))
    }
    extendBase(definition)
    return definition
}

module.exports = {
    define,
    extendBase,
    isReservedWord,
    requireImplementation,
    reservedWords,
    reservedWordsApplyInstances,
    resolveCoreDependency,
    resolveCoreDependencies,
}
