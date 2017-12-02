const {
    extend,
    isGraph,
} = require('./utility')

describe('extend', () => {
    it('deeply merges properties of input into output, if no properties in output conflict with input', () => {
        const output = {
            operation: {
                streams: {
                    'stream key 1': {
                        of: 'stream type 1',
                    },
                    'stream key 2': {
                        of: 'stream type 2',
                    },
                },
            },
        }
        const input = {
            operation: {
                of: 'operation output type',
                streams: {
                    'stream key 3': {
                        of: 'stream type 3',
                    },
                },
            },
        }
        extend(output, input)
        expect(output).toEqual({
            operation: {
                of: 'operation output type',
                streams: {
                    'stream key 1': {
                        of: 'stream type 1',
                    },
                    'stream key 2': {
                        of: 'stream type 2',
                    },
                    'stream key 3': {
                        of: 'stream type 3',
                    },
                },
            },
        })
    })
    it('throws an error if a property in output conflicts with input', () => {
        const output = {
            operation: {
                of: 'operation output type',
                streams: {
                    'stream key 1': {
                        of: 'stream type 1',
                    },
                    'stream key 2': {
                        of: 'stream type 2',
                    },
                },
            },
        }
        const input = {
            operation: {
                of: 'operation output type',
                streams: {
                    'stream key 3': {
                        of: 'stream type 3',
                    },
                },
            },
        }
        expect(() => extend(output, input)).toThrow()
    })
})

describe('isGraph', () => {
    it('returns true if and only if given a non-Array, non-null object', () => {
        expect(isGraph({})).toEqual(true)
        expect(isGraph([])).toEqual(false)
        expect(isGraph(0)).toEqual(false)
        expect(isGraph('')).toEqual(false)
        expect(isGraph(false)).toEqual(false)
        expect(isGraph(null)).toEqual(false)
        expect(isGraph(undefined)).toEqual(false)
        expect(isGraph()).toEqual(false)
    })
})
