const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const exceptions = require('./exceptions')

const define = (pathToFile) => {
    const file = fs.readFileSync(`${pathToFile}.yml`, 'utf8')
    const definition = yaml.safeLoad(file)
    const root = path.parse(pathToFile).dir
    if (definition.dictionary) {
        for (const name in definition.dictionary) {
            const pathToName = definition.dictionary[name]
                ? path.resolve(root, definition.dictionary[name])
                : path.resolve(__dirname, `../core/${name}`)
            definition.dictionary[name] = define(pathToName)
        }
    } else if (definition.implementation) {
        const pathToName = definition.implementation
            ? path.resolve(root, definition.implementation)
            : path.resolve(__dirname, `../core/${definition.name}`)
        definition.implementation = require(pathToName)
    } else {
        throw exceptions.operationTypeNotValid(definition.name)
    }
    return definition
}

module.exports = define
