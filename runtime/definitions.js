const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const exceptions = require('./exceptions')
const extend = require('./extend')
const graph = require('./graph')
const replace = require('./replace')
const types = require('./types')

const construct = (definition, instance) => {
    const genericDefinition = graph(definition.generic)
    const specificInstance = types.isSpecific(instance.of)
    if ((specificInstance && genericDefinition) || (!specificInstance && !genericDefinition)) {
        throw exceptions.instanceNotApplicable(instance.of, definition.name)
    }
    if (specificInstance) {
        return definition
    }
    definition.generic = replace(definition.generic)
    const parameters = types.parametersOf(instance.of)
    for (const key in definition.generic) {
        types.assertApplicable(parameters[key], definition.generic[key])
    }
    return replace(definition, parameters, {})
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
    if (graph(definition.dictionary)) {
        for (const name in definition.dictionary) {
            const path = definition.dictionary[name]
            definition.dictionary[name] = define(resolvePath(path, root, name))
        }
    }
    extend(definition)
    if (!definition.abstract && !definition.operations) {
        const path = definition.implementation
        definition.implementation = require(resolvePath(path, root, definition.name))
    }
    return definition
}

module.exports = {
    construct,
    define,
    resolvePath,
}
