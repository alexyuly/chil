const {
    isReservedIdentifier,
    requireImplementation,
    reservedIdentifiersFromValues,
} = require('./definition')

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

describe('requireImplementation', () => {
    it('when the definition has a graph of operations, does not mutate the target', () => {
        const originalDefinition = {
            operations: {},
        }
        const definition = {
            operations: {},
        }
        const path = 'not relevant'
        requireImplementation(definition, path)
        expect(definition).toEqual(originalDefinition)
    })
    it('when the definition has no graph of operations, assigns an implementation required from the path', () => {
        const definition = {}
        const path = './definition'
        requireImplementation(definition, path)
        expect(definition.implementation).toBe(require('./definition'))
    })
})

describe('reservedIdentifiersFromValues', () => {
    it('when the set of instances is not a graph, does not mutate the target', () => {
        const originalTarget = {}
        const target = {}
        reservedIdentifiersFromValues(target, undefined)
        expect(target).toEqual(originalTarget)
    })
    // TODO
})
