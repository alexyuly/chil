const assert = require('assert')
const { extend, isGraph } = require('./utility')

/**
 * @param {string | object} type - a type
 * @param {function} specific - a function which is called if the type no parameters
 * @param {function} generic - a function which is called if the type has parameters
 * @returns {*} the result of a call to specific or generic
 */
const branch = ({ type, specific, generic }) => {
    if (typeof type === 'string') {
        return specific()
    }
    if (isGraph(type)) {
        return generic()
    }
    throw new Error(`type ${JSON.stringify(type)} is neither specific nor generic`)
}

/**
 * @param {string | object} type - a type
 * @returns {string | undefined} the name of the type
 */
const nameOf = (type) => branch({
    type,
    specific: () => type,
    generic: () => {
        for (const key in type) {
            return key
        }
        return undefined
    },
})

/**
 * @param {string | object} type - a type
 * @returns {object | undefined} the parameters of the type
 */
const parametersOf = (type) => branch({
    type,
    specific: () => undefined,
    generic: () => {
        for (const key in type) {
            return type[key]
        }
        return undefined
    },
})

/**
 * Replaces occurrences of named parameters within an input object, to a new output object.
 * @param {object} input - an object from which properties are read
 * @param {object} [parameters] - an object which maps names of parameters to types
 * @param {object} [output] - an object to which properties are written
 * @returns {object} output
 */
const replaceParameters = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (node instanceof Array) {
            output[key] = replaceParameters(node, parameters, [])
        } else if (isGraph(node)) {
            output[key] = replaceParameters(node, parameters, {})
        } else if (typeof node === 'string') {
            for (const alias in parameters) {
                if (node === alias) {
                    output[key] = parameters[alias]
                    break
                }
            }
            if (!(key in output)) {
                output[key] = input[key]
            }
        } else {
            output[key] = null
        }
    }
    return output
}

/**
 * @param {object} definition - an operation definition which is mutated by this function
 * @param {string | object} type - an operation type
 * @returns {object} a definition which is an application of the type (and has NOT been checked for type safety)
 */
const applyParameters = (definition, type) => branch({
    type,
    specific: () => definition,
    generic: () => {
        assert(
            isGraph(definition.parameters),
            `definition of ${definition.name} expected no parameters in type ${JSON.stringify(type)}`
        )
        const parameters = parametersOf(type)
        for (const key in definition.parameters) {
            assert(
                key in parameters,
                `definition of ${definition.name} expected a parameter named ${key} in type ${JSON.stringify(type)}`
            )
        }
        return replaceParameters(definition, parameters, {})
    },
})

/**
 * @param {string | object} type - a type
 * @param {object} dependencies - a map of names to operation definitions
 * @returns {object} a parameterized operation definition for the type, based on dependencies
 */
const defineOperationType = (type, dependencies) => {
    if (nameOf(type) === 'operation') {
        return type
    }
    assert(
        isGraph(dependencies),
        `cannot define type ${JSON.stringify(type)}: expected dependencies but got ${JSON.stringify(dependencies)}`
    )
    const definition = dependencies[nameOf(type)]
    assert(
        isGraph(definition),
        `cannot define type ${JSON.stringify(type)}: expected a dependency definition but got ${JSON.stringify(definition)}`
    )
    return applyParameters(definition, type)
}

/**
 * @param {string | object} type - a type
 * @returns {boolean} true if and only if the type is an operation type
 */
const isOperationType = (type) => {
    if (type instanceof Array || type === null) {
        return false
    }
    switch (nameOf(type)) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'vector':
        case 'struct':
            return false
        default:
            return typeof type === 'string' || isGraph(type)
    }
}

/**
 * @param {string | object} type - an operation type
 * @param {object} dependencies - a map of names to operation definitions
 * @param {object} [output] - an object which is mutated by this function
 * @returns {object} output after mutations are performed
 */
const reduceOperationType = (type, dependencies, output = {}) => {
    const definition = defineOperationType(type, dependencies)
    const base = {
        operation: {},
    }
    if (definition.of) {
        base.operation.of = definition.of
    }
    if (definition.streams) {
        base.operation.streams = definition.streams
    }
    extend(output, base)
    if (definition.is) {
        assert(
            isOperationType(definition.is),
            `cannot extend operation definition of ${definition.name} from non-operation type ${JSON.stringify(definition.is)}`
        )
        reduceOperationType(definition.is, definition.dependencies, output)
    }
    return output
}

/**
 * @param {string | object} type - a stream type
 * @param {string | object} domain - a stream type which is a superset of other types
 * @returns {boolean} true if and only if the type is a subset of the domain
 */
const isApplicableStream = (type, domain) => {
    if (type === undefined || domain === undefined) {
        return false
    }
    if (domain === null) {
        return true
    }
    if (type === null) {
        return false
    }
    const typeUnion = type instanceof Array
    const domainUnion = domain instanceof Array
    if (typeUnion && !domainUnion) {
        return false
    }
    if (!typeUnion && domainUnion) {
        return domain.some((domainMember) =>
            isApplicableStream(type, domainMember))
    }
    if (typeUnion && domainUnion) {
        return type.every((typeMember) =>
            domain.some((domainMember) =>
                isApplicableStream(typeMember, domainMember)))
    }
    return branch({
        type,
        specific: () => {
            if (type === 'number' || type === 'string' || type === 'boolean') {
                return type === domain
            }
            throw new Error(`invalid stream type ${JSON.stringify(type)}`)
        },
        generic: () => {
            const typeName = nameOf(type)
            if (typeName !== nameOf(domain) || !isGraph(domain)) {
                return false
            }
            const typeParameters = parametersOf(type)
            const domainParameters = parametersOf(domain)
            if (typeName === 'vector') {
                return isApplicableStream(typeParameters, domainParameters)
            }
            if (typeName === 'struct') {
                return Object.keys(domainParameters).every((key) =>
                    isApplicableStream(typeParameters[key], domainParameters[key]))
            }
            throw new Error(`invalid stream type ${JSON.stringify(type)}`)
        },
    })
}

/**
 * @param {string | object} type - any type
 * @param {string | object} domain - a type which is a superset of other types
 * @param {object} [dependencies] - a map of names to operation definitions
 * @returns {boolean} true if and only if the type is a subset of the domain
 */
const isApplicable = (type, domain, dependencies) => {
    if (type === undefined || domain === undefined) {
        return false
    }
    if (!isOperationType(type)) {
        return !isOperationType(domain) && isApplicableStream(type, domain)
    }
    if (!isOperationType(domain)) {
        return false
    }
    const reducedType = reduceOperationType(type, dependencies)
    const reducedDomain = reduceOperationType(domain, dependencies)
    return isApplicable(reducedType.of, reducedDomain.of, dependencies) &&
        Object.keys(reducedDomain.streams.of).every((key) =>
            isApplicable(reducedType.streams.of[key], reducedDomain.streams.of[key], dependencies))
}

/**
 * Construct an applied operation definition, and then check type parameters.
 * @param {object} definition - an operation definition which is mutated by this function
 * @param {string | object} type - an operation type
 * @returns {object} a definition which is an application of the type and has been checked for type safety
 */
const construct = (definition, type) => {
    const parameters = parametersOf(type)
    const domains = replaceParameters(definition.parameters)
    for (const key in domains) {
        assert(
            isApplicable(parameters[key], domains[key], definition.dependencies),
            `type ${JSON.stringify(parameters[key])} is not applicable to domain ${JSON.stringify(domains[key])}`
        )
    }
    return applyParameters(definition, type)
}

module.exports = {
    applyParameters,
    branch,
    construct,
    defineOperationType,
    isApplicable,
    isApplicableStream,
    isOperationType,
    nameOf,
    parametersOf,
    reduceOperationType,
    replaceParameters,
}
