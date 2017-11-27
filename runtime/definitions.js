const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const exceptions = require('./exceptions')
const { assertApplicable, branch, nameOf, parametersOf } = require('./types')
const { isGraph } = require('./utility')

/**
 * Assigns a given type definition's implementation class to the definition, if possible.
 * @param {object} definition a type definition
 * @param {string} path a path to the type definition
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
 * Determines whether or not a given word is reserved
 * @param {string} word a string
 * @param {object} reserved a set of reserved words returned by reservedWords
 * @returns {boolean} true if and only if word is reserved
 */
const isReservedWord = (word, reserved) => {
    for (const reservedWord in reserved) {
        if (word === reservedWord) {
            return true
        }
    }
    return false
}

/**
 * Assigns the absolute path of a core dependency to a given type definition, if possible.
 * @param {object} definition a type definition
 * @param {object} reserved a set of reserved words returned by reservedWords
 * @param {string} name the name of a core dependency
 */
const resolveCoreDependency = (definition, reserved, name) => {
    if (isReservedWord(name, reserved)) {
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
const resolveCoreDependencies = (definition, reserved = reservedWords(definition), set = definition) => {
    for (const key in set) {
        const value = set[key]
        resolveCoreDependency(definition, reserved, key)
        branch({
            type: value,
            specific: () => resolveCoreDependency(definition, reserved, value),
            generic: () => resolveCoreDependencies(definition, reserved, value),
        })
    }
}

const replaceParameters = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (key === 'name' || key === 'dependencies') {
            output[key] = input[key]
        } else if (isGraph(node)) {
            output[key] = replaceParameters(
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

const construct = (definition, type) => branch({
    type,
    specific: () => definition,
    generic: () => {
        if (!isGraph(definition.parameters)) {
            throw exceptions.constructionNotValid(definition, nameOf(type))
        }
        const parameters = parametersOf(type)
        definition.parameters = replaceParameters(definition.parameters)
        for (const key in definition.parameters) {
            assertApplicable(parameters[key], definition.parameters[key])
        }
        return replaceParameters(definition, parameters, {})
    },
})

const extendBase = (definition, base = branch({
    type: definition.is,
    specific: () => definition.dependencies[definition.is],
    generic: () => construct(definition.dependencies[definition.is], definition.is),
})) => {
    for (const key in base) {
        const target = definition[key]
        const source = base[key]
        if (isGraph(target) && isGraph(source)) {
            extendBase(target, source)
        } else if (target === undefined) {
            definition[key] = source
        } else if (key !== 'name') {
            throw exceptions.definitionBaseConflict(definition, base)
        }
    }
}

/**
 * Create a type definition based on a given file system path.
 * @param {string} path a path to a type definition
 * @returns {object} a type definition
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
    construct,
    define,
    extendBase,
    isReservedWord,
    replaceParameters,
    requireImplementation,
    reservedWords,
    reservedWordsApplyInstances,
    resolveCoreDependency,
    resolveCoreDependencies,
}
