const exceptions = require('./exceptions')
const { isGraph } = require('./utility')

const assertApplicable = (type, domain) => {
    const isNotApplicable = () => {
        // TODO
    }
    if (isNotApplicable(type, domain)) {
        throw exceptions.typeNotApplicable(type, domain)
    }
}

const isSpecific = (type) => typeof type === 'string'

const nameOf = (type) => {
    if (isSpecific(type)) {
        return type
    }
    if (isGraph(type)) {
        for (const key in type) {
            return key
        }
    }
    throw exceptions.typeNotValid(type)
}

const parametersOf = (type) => {
    if (isSpecific(type)) {
        return undefined
    }
    if (isGraph(type)) {
        for (const key in type) {
            return type[key]
        }
    }
    throw exceptions.typeNotValid(type)
}

module.exports = {
    assertApplicable,
    isSpecific,
    nameOf,
    parametersOf,
}
