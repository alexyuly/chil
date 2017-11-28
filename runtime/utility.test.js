const { isGraph } = require('./utility')

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
