const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const types = require('./types')

const excludedKeys = [
    'name',
    'abstract',
]

const path = (name, root, branch) => {
    if (branch) {
        return resolve(parse(root).dir, branch)
    }
    return resolve(__dirname, `./definitions/${name}`)
}

const define = (root) => {
    const file = fs.readFileSync(`${root}.yml`, 'utf8')
    const definition = yaml.safeLoad(file)
    if (types.isGraph(definition.dictionary)) {
        for (const name in definition.dictionary) {
            definition.dictionary[name] = define(path(name, root, definition.dictionary[name]))
        }
    }
    const abstractName = types.nameOf(definition.is)
    const abstractSpecificInstance = types.isSpecific(definition.is)
    const abstractDefinition = abstractSpecificInstance
        ? definition.dictionary[abstractName]
        : types.construct(definition.dictionary[abstractName], { of: definition.is })
    for (const key in abstractDefinition) {
        if (!excludedKeys.includes(key) && (abstractSpecificInstance || key !== 'generic')) {
            definition[key] = abstractDefinition[key]
        }
    }
    if (!definition.abstract && !definition.operations) {
        definition.implementation = require(path(definition.name, root, definition.implementation))
    }
    return definition
}

module.exports = define
