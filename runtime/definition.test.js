const {
    parse,
} = require('path')

const {
    requireImplementation,
    reservedIdentifiers,
    reservedIdentifiersFromValues,
    isReservedIdentifier,
    coreDependencyPath,
    resolveCoreDependency,
    resolveCoreDependencies,
} = require('./definition')

const mockDefinition = () => ({
    name: 'definition name',
    dependencies: {
        'dependency name 1': 'dependency value 1',
        'dependency name 2': 'dependency value 2',
    },
    parameters: {
        'parameter type 1': [
            'parameter value 1',
            {
                'parameter value 2': 'parameter value 3',
            },
        ],
        'parameter type 2': {
            'parameter value 4': 'parameter type 1',
        },
    },
    of: 'definition output type',
    values: {
        'value key 1': {
            of: 'parameter type 1',
            initial: 'event',
            to: {
                'operation key 1': 'operation target 1',
                'operation key 2': 'operation target 1',
            },
        },
        'value key 2': {
            of: 'parameter type 2',
            to: {
                'operation key 1': 'operation target 2',
            },
        },
    },
    operations: {
        'operation key 1': {
            of: 'operation type 1',
            initial: {
                'operation target 1': 'event',
            },
        },
    },
})

describe('requireImplementation', () => {
    it('when the definition has a graph of operations, does not mutate the target', () => {
        const definition = {
            operations: {},
        }
        const path = 'not relevant'
        requireImplementation(definition, path)
        expect(definition).toEqual({
            operations: {},
        })
    })
    it('when the definition has no graph of operations, assigns an implementation required from the path', () => {
        const definition = {}
        const path = './definition'
        requireImplementation(definition, path)
        expect(definition.implementation).toBe(require('./definition'))
    })
})

describe('reservedIdentifiersFromValues', () => {
    it('when the set of values is not a graph, does not mutate the target', () => {
        const target = {}
        reservedIdentifiersFromValues(target, undefined)
        expect(target).toEqual({})
    })
    it('when the set of values is a graph, mutates the target according to properties of the values', () => {
        const target = {}
        reservedIdentifiersFromValues(target, mockDefinition().values)
        reservedIdentifiersFromValues(target, mockDefinition().operations)
        expect(target).toEqual({
            'operation key 1': null,
            'operation key 2': null,
            'operation target 1': null,
            'operation target 2': null,
            'value key 1': null,
            'value key 2': null,
        })
    })
})

describe('reservedIdentifiers', () => {
    const defaultIdentifiers = () => ({
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
    })
    it('when the definition is empty, returns the set of default identifiers', () => {
        expect(reservedIdentifiers({})).toEqual(defaultIdentifiers())
    })
    it('when the definition contains a string name, returns a set which includes that name', () => {
        expect(reservedIdentifiers({
            name: mockDefinition().name,
        })).toEqual(Object.assign(
            defaultIdentifiers(),
            {
                'definition name': null,
            }
        ))
    })
    it('when the definition contains a graph of dependencies, returns a set which includes their names and paths', () => {
        expect(reservedIdentifiers({
            dependencies: mockDefinition().dependencies,
        })).toEqual(Object.assign(
            defaultIdentifiers(),
            {
                'dependency name 1': null,
                'dependency name 2': null,
                'dependency value 1': null,
                'dependency value 2': null,
            }
        ))
    })
    it('when the definition contains a graph of parameters, returns a set which includes their names', () => {
        expect(reservedIdentifiers({
            parameters: mockDefinition().parameters,
        })).toEqual(Object.assign(
            defaultIdentifiers(),
            {
                'parameter type 1': null,
                'parameter type 2': null,
            }
        ))
    })
    it('when the definition contains graphs of values and operations, returns a set which includes their names', () => {
        expect(reservedIdentifiers({
            values: mockDefinition().values,
            operations: mockDefinition().operations,
        })).toEqual(Object.assign(
            defaultIdentifiers(),
            {
                'operation key 1': null,
                'operation key 2': null,
                'operation target 1': null,
                'operation target 2': null,
                'value key 1': null,
                'value key 2': null,
            }
        ))
    })
})

describe('isReservedIdentifier', () => {
    it('returns true if and only if the identifier is present as a key in the object', () => {
        const reservedIdentifierSet = {
            A: null,
            B: null,
        }
        expect(isReservedIdentifier('A', reservedIdentifierSet)).toEqual(true)
        expect(isReservedIdentifier('C', reservedIdentifierSet)).toEqual(false)
    })
})

describe('coreDependencyPath', () => {
    it('returns an object with one property named "absolute" which contains a path with the name', () => {
        const name = 'test'
        const path = coreDependencyPath(name)
        expect(parse(path.absolute).name).toEqual(name)
    })
})

describe('resolveCoreDependency', () => {
    it('when the name is a reserved identifier, does not mutate the definition', () => {
        const definition = {}
        const reservedIdentifierSet = {
            'reserved identifier': null,
        }
        const name = 'reserved identifier'
        resolveCoreDependency(definition, reservedIdentifierSet, name)
        expect(definition).toEqual({})
    })
    it('when the name is not a reserved identifier, assigns an absolute path to the definition dependencies', () => {
        const definition = {}
        const reservedIdentifierSet = {
            'reserved identifier': null,
        }
        const name = 'not a reserved identifier'
        resolveCoreDependency(definition, reservedIdentifierSet, name)
        expect(definition).toEqual({
            dependencies: {
                [name]: coreDependencyPath(name),
            },
        })
    })
})

describe('resolveCoreDependencies', () => {
    it('assigns core dependencies to the definition', () => {
        const definition = mockDefinition()
        resolveCoreDependencies(definition)
        expect(definition.dependencies).toEqual({
            'definition output type': coreDependencyPath('definition output type'),
            'dependency name 1': 'dependency value 1',
            'dependency name 2': 'dependency value 2',
            'operation type 1': coreDependencyPath('operation type 1'),
            'parameter value 4': coreDependencyPath('parameter value 4'),
            'parameter value 1': coreDependencyPath('parameter value 1'),
            'parameter value 2': coreDependencyPath('parameter value 2'),
            'parameter value 3': coreDependencyPath('parameter value 3'),
        })
    })
})
