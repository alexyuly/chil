const exception = require('./exception')
const { extend, isGraph } = require('./utility')

/**
 * @param {string | object} type - a type
 * @param {function} specific - a function which is called if the type no parameters
 * @param {function} generic - a function which is called if the type has parameters
 * @returns {*} the result of a call to specific or generic
 */
const branch = ({ type, specific, generic }) => {
    if (type instanceof Array) {
        throw exception.unionTypeIllegal(type)
    }
    if (typeof type === 'string') {
        return specific()
    }
    if (isGraph(type)) {
        return generic()
    }
    throw exception.typeNotValid(type)
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
const reduceParameters = (input, parameters = {}, output = parameters) => {
    for (const key in input) {
        const node = input[key]
        if (key === 'name' || key === 'dependencies') {
            output[key] = input[key]
        } else if (node instanceof Array) {
            output[key] = reduceParameters(node, parameters, [])
        } else if (isGraph(node)) {
            output[key] = reduceParameters(node, parameters, {})
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

/**
 * @param {object} definition - an operation definition which is mutated by this function
 * @param {string | object} type - an operation type
 * @returns {object} an operation definition updated with parameters from the type
 */
const applyParameters = (definition, type) => branch({
    type,
    specific: () => definition,
    generic: () => {
        if (!isGraph(definition.parameters)) {
            throw exception.typeParametersNotApplicable(definition, type)
        }
        definition.parameters = reduceParameters(definition.parameters)
        return reduceParameters(definition, parametersOf(type), {})
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
            return true
    }
}

/**
 * @param {string | object} type - an operation type
 * @param {object} dependencies - a map of names to operation definitions
 * @param {object} [target] - an object which is mutated by this function
 * @returns {object} target after mutations are performed
 */
const reduceOperationType = (type, dependencies, target = {}) => {
    if (isGraph(type.operation)) {
        return type
    }
    if (!isGraph(dependencies)) {
        throw exception.typeNotResolved(type)
    }
    const dependency = dependencies[nameOf(type)]
    if (!isGraph(dependency)) {
        throw exception.typeNotResolved(type)
    }
    const definition = branch({
        type,
        specific: () => dependency,
        generic: () => applyParameters(dependency, type),
    })
    const base = {
        operation: {},
    }
    if (definition.of) {
        base.operation.of = definition.of
    }
    if (definition.values) {
        base.operation.values = definition.values
    }
    extend(target, base)
    if (definition.is) {
        reduceOperationType(definition.is, dependencies, target)
    }
    return target
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
            Object.keys(reducedDomain.values).every((key) => isApplicable(reducedType.values[key], reducedDomain.values[key], dependencies))
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
            throw exception.typeNotValid(type)
        },
    })
}

/**
 * Throws an exception if a type is not a subset of another type.
 * @param {string | object} type - a type
 * @param {string | object} domain - a type which is a superset of other types
 * @param {object} [dependencies] - a map of names to operation definitions
 */
const assertApplicable = (type, domain, dependencies) => {
    if (!isApplicable(type, domain, dependencies)) {
        throw exception.typeNotApplicable(type, domain)
    }
}

/**
 * Construct an applied operation definition, and then validate type parameters.
 * @param {object} definition - an operation definition which is mutated by this function
 * @param {string | object} type - an operation type
 * @returns {object} an operation definition updated with parameters from the type
 */
const construct = (definition, type) => {
    const result = applyParameters(definition, type)
    const parameters = parametersOf(type)
    for (const key in result.parameters) {
        assertApplicable(parameters[key], result.parameters[key], result.dependencies)
    }
    return result
}

module.exports = {
    applyParameters,
    assertApplicable,
    branch,
    construct,
    isApplicable,
    isOperationType,
    nameOf,
    parametersOf,
    reduceOperationType,
    reduceParameters,
}
