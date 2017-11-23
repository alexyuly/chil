const exceptions = require('./exceptions')
const graph = require('./graph')

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
    if (graph(type)) {
        for (const key in type) {
            return key
        }
    }
    throw exceptions.typeNotValid(type)
}

const parametersOf = (type) => {
    if (graph(type)) {
        for (const key in type) {
            return type[key]
        }
    }
    return undefined
}

module.exports = {
    assertApplicable,
    isSpecific,
    nameOf,
    parametersOf,
}
