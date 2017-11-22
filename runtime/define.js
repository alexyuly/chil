const fs = require('fs')
const { parse, resolve } = require('path')
const yaml = require('js-yaml')
const types = require('./types')

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
    } else {
        definition.implementation = require(path(definition.name, root, definition.implementation))
    }
    return definition
}

module.exports = define
