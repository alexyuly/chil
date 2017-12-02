const {
    parse,
} = require('path')

const {
    requireImplementation,
    reservedIdentifiers,
    reservedIdentifiersFromStreams,
    isReservedIdentifier,
    coreDependencyPath,
    resolveCoreDependency,
    resolveCoreDependencies,
} = require('./definition')

const mockDefinition = () => ({
    name: 'definition name',
    dependencies: {
        'dependency name 1': 'dependency stream 1',
        'dependency name 2': 'dependency stream 2',
    },
    parameters: {
        'parameter type 1': [
            'parameter stream 1',
            {
                'parameter stream 2': 'parameter stream 3',
            },
        ],
        'parameter type 2': {
            'parameter stream 4': 'parameter type 1',
        },
    },
    of: 'definition output type',
    streams: {
        'stream key 1': {
            of: 'parameter type 1',
            initial: 'event',
            to: {
                'operation key 1': 'operation target 1',
                'operation key 2': 'operation target 1',
            },
        },
        'stream key 2': {
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

describe('reservedIdentifiersFromStreams', () => {
    it('when the set of streams is not a graph, does not mutate the target', () => {
        const target = {}
        reservedIdentifiersFromStreams(target, undefined)
        expect(target).toEqual({})
    })
    it('when the set of streams is a graph, mutates the target according to properties of the streams', () => {
        const target = {}
        reservedIdentifiersFromStreams(target, mockDefinition().streams)
        reservedIdentifiersFromStreams(target, mockDefinition().operations)
        expect(target).toEqual({
            'operation key 1': null,
            'operation key 2': null,
            'operation target 1': null,
            'operation target 2': null,
            'stream key 1': null,
            'stream key 2': null,
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
        streams: null,
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
                'dependency stream 1': null,
                'dependency stream 2': null,
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
    it('when the definition contains graphs of streams and operations, returns a set which includes their names', () => {
        expect(reservedIdentifiers({
            streams: mockDefinition().streams,
            operations: mockDefinition().operations,
        })).toEqual(Object.assign(
            defaultIdentifiers(),
            {
                'operation key 1': null,
                'operation key 2': null,
                'operation target 1': null,
                'operation target 2': null,
                'stream key 1': null,
                'stream key 2': null,
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
            'dependency name 1': 'dependency stream 1',
            'dependency name 2': 'dependency stream 2',
            'operation type 1': coreDependencyPath('operation type 1'),
            'parameter stream 4': coreDependencyPath('parameter stream 4'),
            'parameter stream 1': coreDependencyPath('parameter stream 1'),
            'parameter stream 2': coreDependencyPath('parameter stream 2'),
            'parameter stream 3': coreDependencyPath('parameter stream 3'),
        })
    })
})
