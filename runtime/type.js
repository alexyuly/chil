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
 * @returns {object} an operation definition updated with parameters from the type
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
    if (nameOf(type) === 'operation') {
        return type
    }
    assert(
        isGraph(dependencies),
        `cannot resolve type ${JSON.stringify(type)}: expected dependencies but got ${JSON.stringify(dependencies)}`
    )
    const dependency = dependencies[nameOf(type)]
    assert(
        isGraph(dependency),
        `cannot resolve type ${JSON.stringify(type)}: expected dependency but got ${JSON.stringify(dependency)}`
    )
    const definition = branch({
        type,
        specific: () => dependency,
        generic: () => applyParameters(dependency, type),
    })
    const input = {
        operation: {},
    }
    if (definition.of) {
        input.operation.of = definition.of
    }
    if (definition.values) {
        input.operation.values = definition.values
    }
    extend(output, input)
    if ('is' in definition) {
        assert(
            isOperationType(definition.is),
            `cannot extend operation definition of ${definition.name} from non-operation type ${JSON.stringify(definition.is)}`
        )
        reduceOperationType(definition.is, definition.dependencies, output)
    }
    return output
}

/**
 * @param {string | object} type - a type
 * @param {string | object} domain - a type which is a superset of other types
 * @param {object} [dependencies] - a map of names to operation definitions
 * @returns {boolean} true if and only if the type is a subset of the domain
 */
const isApplicable = (type, domain, dependencies) => {
    if (type === undefined || domain === undefined) {
        return false
    }
    if (isOperationType(type)) {
        if (!isOperationType(domain)) {
            return false
        }
        const reducedType = reduceOperationType(type, dependencies)
        const reducedDomain = reduceOperationType(domain, dependencies)
        return isApplicable(reducedType.of, reducedDomain.of, dependencies) &&
            Object.keys(reducedDomain.values.of).every((key) =>
                isApplicable(reducedType.values.of[key], reducedDomain.values.of[key], dependencies))
    }
    if (isOperationType(domain)) {
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
        return domain.some((domainChild) => isApplicable(type, domainChild))
    }
    if (typeUnion && domainUnion) {
        return type.every((typeChild) => domain.some((domainChild) => isApplicable(typeChild, domainChild)))
    }
    return branch({
        type,
        specific: () => type === domain,
        generic: () => {
            const typeName = nameOf(type)
            if (typeName !== nameOf(domain) || !isGraph(domain)) {
                return false
            }
            const typeParameters = parametersOf(type)
            const domainParameters = parametersOf(domain)
            if (typeName === 'vector') {
                return isApplicable(typeParameters, domainParameters)
            }
            if (typeName === 'struct') {
                return Object.keys(domainParameters).every((key) => isApplicable(typeParameters[key], domainParameters[key]))
            }
            throw new Error(`unexpected type ${JSON.stringify(type)}`)
        },
    })
}

/**
 * Construct an applied operation definition, and then validate type parameters.
 * @param {object} definition - an operation definition which is mutated by this function
 * @param {string | object} type - an operation type
 * @returns {object} an operation definition updated with parameters from the type
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
    isApplicable,
    isOperationType,
    nameOf,
    parametersOf,
    reduceOperationType,
    replaceParameters,
}
