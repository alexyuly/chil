const {
    branch,
    nameOf,
    parametersOf,
    replaceParameters,
} = require('./type')

describe('branch', () => {
    it('calls the specific function if passed a string (specific type)', () => {
        const type = 'a specific type'
        const specific = jest.fn()
        branch({
            type,
            specific,
        })
        expect(specific).toHaveBeenCalledTimes(1)
    })
    it('calls the generic function if passed a non-null, non-Array object (generic type)', () => {
        const type = {
            'a generic type': 'a parameter type',
        }
        const generic = jest.fn()
        branch({
            type,
            generic,
        })
        expect(generic).toHaveBeenCalledTimes(1)
    })
    it('throws an exception if passed anything else, including an Array or any other value', () => {
        expect(() => branch({ type: [] })).toThrow()
        expect(() => branch({ type: 0 })).toThrow()
        expect(() => branch({ type: false })).toThrow()
        expect(() => branch({ type: null })).toThrow()
        expect(() => branch({ type: undefined })).toThrow()
        expect(() => branch({})).toThrow()
    })
})

describe('nameOf', () => {
    it('returns the type itself if the type is specific', () => {
        expect(nameOf('a specific type')).toEqual('a specific type')
    })
    it('returns the first key of a type if the type is generic', () => {
        expect(nameOf({
            'a generic type': {
                'a parameter key': 'a parameter type',
            },
        })).toEqual('a generic type')
    })
})

describe('parametersOf', () => {
    it('returns undefined if the type is specific', () => {
        expect(parametersOf('a specific type')).toEqual(undefined)
    })
    it('returns the first value of a type if the type is generic', () => {
        expect(parametersOf({
            'a generic type': {
                'a parameter key': 'a parameter type',
            },
        })).toEqual({
            'a parameter key': 'a parameter type',
        })
    })
})

describe('replaceParameters', () => {
    const parameters = () => ({
        A: null,
        B: {
            BA: null,
        },
        C: {
            CA: null,
            CB: {
                BA: null,
            },
        },
        D: {
            DA: {
                DB: {
                    CA: null,
                    CB: {
                        BA: null,
                    },
                },
            },
        },
        E: [
            null,
        ],
        F: [
            null,
            {
                BA: null,
            },
        ],
        G: [
            [
                {
                    CA: null,
                    CB: {
                        BA: null,
                    },
                },
            ],
        ],
        H: [
            {
                HA: {
                    DA: {
                        DB: {
                            CA: null,
                            CB: {
                                BA: null,
                            },
                        },
                    },
                },
                HB: {
                    HC: [
                        null,
                    ],
                },
            },
        ],
    })
    it('when given no parameters, deeply replaces values which reference previous keys within the input object', () => {
        const selfReferencingParameters = {
            A: null,
            B: {
                BA: 'A',
            },
            C: {
                CA: 'A',
                CB: 'B',
            },
            D: {
                DA: {
                    DB: 'C',
                },
            },
            E: [
                'A',
            ],
            F: [
                'A',
                'B',
            ],
            G: [
                [
                    'C',
                ],
            ],
            H: [
                {
                    HA: 'D',
                    HB: {
                        HC: 'E',
                    },
                },
            ],
        }
        expect(replaceParameters(selfReferencingParameters)).toEqual(parameters())
    })
    it('when given parameters, deeply replaces values which reference parameter keys with parameters, except name and dependencies', () => {
        const definition = {
            name: 'A',
            dependencies: {
                B: 'C',
                C: 'D',
            },
            parameters: parameters(),
            is: 'C',
            of: 'D',
            values: {
                x: {
                    of: 'F',
                },
            },
            operations: {
                x: {
                    of: 'G',
                },
                y: {
                    of: 'H',
                },
            },
        }
        const parameterValues = {
            A: 'A replacement',
            B: 'B replacement',
            C: 'C replacement',
            D: 'D replacement',
            E: 'E replacement',
            F: 'F replacement',
            G: 'G replacement',
            H: 'H replacement',
        }
        const replacedDefinition = {
            name: 'A',
            dependencies: {
                B: 'C',
                C: 'D',
            },
            parameters: parameters(),
            is: parameterValues.C,
            of: parameterValues.D,
            values: {
                x: {
                    of: parameterValues.F,
                },
            },
            operations: {
                x: {
                    of: parameterValues.G,
                },
                y: {
                    of: parameterValues.H,
                },
            },
        }
        expect(replaceParameters(definition, parameterValues, {})).toEqual(replacedDefinition)
    })
})
