const exception = require('./exception')
const { isGraph } = require('./utility')

const assertApplicable = (type, domain) => {
    const isNotApplicable = () => {
        // TODO
    }
    if (isNotApplicable(type, domain)) {
        throw exception.typeNotApplicable(type, domain)
    }
}

const branch = ({ type, specific, generic }) => {
    if (typeof type === 'string') {
        return specific()
    }
    if (isGraph(type)) {
        return generic()
    }
    throw exception.typeNotValid(type)
}

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

const parametersOf = (type) => branch({
    type,
    specific: () => undefined,
    generic: () => type[0],
})

module.exports = {
    assertApplicable,
    branch,
    nameOf,
    parametersOf,
}
