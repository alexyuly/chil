const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const { construct } = require('./construct')
const { isSpecific, nameOf } = require('./types')
const { isGraph } = require('./utility')

const finalKeys = [
    'name',
    'abstract',
]

// TODO - extend should merge parent and child definitions
const extend = (definition) => {
    const name = nameOf(definition.is)
    const specific = isSpecific(definition.is)
    const superDefinition = specific
        ? definition.dictionary[name]
        : construct(definition.dictionary[name], { of: definition.is })
    for (const key in superDefinition) {
        if (!finalKeys.includes(key) && (specific || key !== 'parameters')) {
            definition[key] = superDefinition[key]
        }
    }
}

const resolvePath = (path, root, name) => {
    if (path) {
        return resolve(parse(root).dir, path)
    }
    return resolve(__dirname, `./definitions/${name}`)
}

const define = (root) => {
    const file = fs.readFileSync(`${root}.yml`, 'utf8')
    const definition = yaml.safeLoad(file)
    if (isGraph(definition.dictionary)) {
        for (const name in definition.dictionary) {
            const path = definition.dictionary[name]
            definition.dictionary[name] = define(resolvePath(path, root, name))
        }
    }
    extend(definition)
    if (definition.abstract === undefined && !definition.operations) {
        const path = definition.implementation
        definition.implementation = require(resolvePath(path, root, definition.name))
    }
    return definition
}

module.exports = {
    define,
    extend,
    resolvePath,
}
