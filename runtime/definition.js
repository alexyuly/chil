const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const { branch, construct, nameOf } = require('./type')
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
        // This definition may be abstract, so the path may not exist.
        // If the path doesn't exist and this definition is constructed by an Operation, an error will be thrown.
    }
}

/**
 * Assigns reserved identifiers implied by a set of value instances, to a target object.
 * @param {object} target - an object which gets mutated by this function
 * @param {object} instances - an object which maps names to value instances
 */
const reservedIdentifiersFromValues = (target, instances) => {
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
                target[key] = null
                target[connections[key]] = null
            }
        }
    }
}

/**
 * Reserved identifiers are names which do not reference a dependency on an operation definition.
 * Reserved identifiers will be ignored during dependency resolution for the operation definition.
 * @param {object} definition - an operation definition
 * @returns {object} the set of reserved identifiers implied by the definition
 */
const reservedIdentifiers = (definition) => {
    // A set of identifiers are reserved by default.
    const set = {
        boolean: null,
        dependencies: null,
        implementation: null,
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
    if (typeof definition.name === 'string') {
        set[definition.name] = null
    }
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
    reservedIdentifiersFromValues(set, definition.values)
    reservedIdentifiersFromValues(set, definition.operations)
    return set
}

/**
 * @param {string} identifier - any string
 * @param {object} reservedIdentifierSet - a set of reserved identifiers returned by reservedIdentifiers
 * @returns {boolean} true if and only if the identifier is reserved
 */
const isReservedIdentifier = (identifier, reservedIdentifierSet) => {
    for (const reservedWord in reservedIdentifierSet) {
        if (identifier === reservedWord) {
            return true
        }
    }
    return false
}

/**
 * @param {string} name - possibly the name of a core dependency
 * @returns {object} a reference to an absolute path to what may be a core dependency
 */
const coreDependencyPath = (name) => ({
    absolute: resolve(__dirname, `./definitions/${name}`),
})

/**
 * Assigns the absolute path of a core dependency to an operation definition, if possible.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {object} reservedIdentifierSet - a set of reserved identifiers returned by reservedIdentifiers
 * @param {string} name - possibly the name of a core dependency
 */
const resolveCoreDependency = (definition, reservedIdentifierSet, name) => {
    if (isReservedIdentifier(name, reservedIdentifierSet)) {
        return
    }
    if (!isGraph(definition.dependencies)) {
        definition.dependencies = {}
    }
    definition.dependencies[name] = coreDependencyPath(name)
}

/**
 * Assigns absolute paths of core dependencies implied by an object, to an operation definition.
 * @param {object} definition - an operation definition which gets mutated by this function
 * @param {object} reservedIdentifierSet - a set of reserved identifiers returned by reservedIdentifiers
 * @param {object} set - an object which is the source of implied core dependencies
 */
const resolveCoreDependencies = (definition, reservedIdentifierSet = reservedIdentifiers(definition), set = definition) => {
    for (const key in set) {
        // The "initial" key is reserved, for an event in case of a value, or a map of value names to events in case of an operation.
        // Events are "literal values" that do not reference type names, so they are not parsed by the definition parser.
        if (key !== 'initial') {
            resolveCoreDependency(definition, reservedIdentifierSet, key)
            const value = set[key]
            for (const type of value instanceof Array ? value : [ value ]) {
                branch({
                    type,
                    specific: () => resolveCoreDependency(definition, reservedIdentifierSet, type),
                    generic: () => resolveCoreDependencies(definition, reservedIdentifierSet, type),
                })
            }
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
    generic: () => construct(definition.dependencies[nameOf(definition.is)], definition.is),
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
    if (definition.is) {
        extendBase(definition)
    }
    return definition
}

module.exports = {
    coreDependencyPath,
    define,
    extendBase,
    isReservedIdentifier,
    requireImplementation,
    reservedIdentifiers,
    reservedIdentifiersFromValues,
    resolveCoreDependency,
    resolveCoreDependencies,
}
