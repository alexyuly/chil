const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const { branch } = require('./types')
const { isGraph } = require('./utility')

/**
 * Assigns a given type definition's implementation class to the definition, if possible.
 * @param {object} definition a type definition
 * @param {string} root path to the type definition
 */
const requireImplementation = (definition, root) => {
    if (isGraph(definition.operations)) {
        // A definition with operations has no implementation.
        return
    }
    try {
        definition.implementation = require(root)
    } finally {
        // This definition may be abstract, so the path may not exist. If the path doesn't exist and this definition is
        // constructed by an Operation, then a definitionNotValid exception will be thrown.
    }
}

/**
 * Assigns reserved words implied by a given set of type instances, to a given target object
 * @param {object} target a set of reserved words
 * @param {object} instances an object which maps names to value type instances
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
 * Creates a set of reserved words from a given type definition.
 * Reserved words are identifiers which do not reference a dependency on some type definition.
 * Reserved words will be ignored during dependency resolution for the given type definition.
 * @param {object} definition a type definition
 * @returns {object} the set of reserved words which exist within the definition
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
 * Determines whether or not a given word is available (i.e., not reserved).
 * @param {string} word a string
 * @param {object} reserved a set of reserved words returned by reservedWords
 * @returns {boolean} True if and only if word is not reserved
 */
const isWordAvailable = (word, reserved) => {
    for (const reservedWord in reserved) {
        if (word === reservedWord) {
            return false
        }
    }
    return true
}

/**
 * Assigns the absolute path of a core dependency to a given type definition, if possible.
 * @param {object} definition a type definition
 * @param {object} reserved a set of reserved words returned by reservedWords
 * @param {string} name the name of a core dependency
 */
const resolveCoreDependency = (definition, reserved, name) => {
    if (!isWordAvailable(name, reserved)) {
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
 * Assigns absolute paths of core dependencies implied by a given object, to a given type definition.
 * @param {object} definition a type definition
 * @param {object} reserved a set of reserved words returned by reservedWords
 * @param {object} set an object which is the source of implied dependencies
 */
const resolveImpliedDependencies = (definition, reserved = reservedWords(definition), set = definition) => {
    for (const key in set) {
        if (isWordAvailable(key, reserved)) {
            resolveCoreDependency(definition, reserved, key)
        }
        const value = set[key]
        branch({
            type: value,
            specific: () => resolveCoreDependency(definition, reserved, value),
            generic: () => resolveImpliedDependencies(definition, reserved, value),
        })
    }
}

const extendBase = () => {
    // TODO
}

/**
 * Create a type definition based on a given file system path.
 * @param {string} root path to a type definition
 * @returns {object} a type definition
 */
const define = (root) => {
    const file = fs.readFileSync(`${root}.yml`, 'utf8')
    const definition = yaml.safeLoad(file)
    requireImplementation(definition, root)
    resolveImpliedDependencies(definition)
    for (const name in definition.dependencies) {
        const path = definition.dependencies[name]
        definition.dependencies[name] = define(path.absolute || resolve(parse(root).dir, path))
    }
    extendBase(definition)
    return definition
}

module.exports = {
    define,
    extendBase,
    isWordAvailable,
    requireImplementation,
    reservedWords,
    reservedWordsApplyInstances,
    resolveCoreDependency,
    resolveImpliedDependencies,
}
