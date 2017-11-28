const { replaceParameters } = require('./type')

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
    it('when given no parameters, deeply replaces values which reference previous keys within a given object', () => {
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
    it('when given parameters, deeply replaces values which reference parameter keys with parameters', () => {
        const definition = {
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
