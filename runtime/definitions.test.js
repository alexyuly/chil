const { replaceParameters } = require('./definitions')

describe('replaceParameters', () => {
    it('iteratively replaces values which reference keys', () => {
        expect(replaceParameters({
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
        })).toEqual({
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
    })
})
