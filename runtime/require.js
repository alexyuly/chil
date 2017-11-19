const fs = require('fs')
const path = require('path')

const fsEncoding = 'utf8'

const definePath = (pathToFile) =>
    JSON.parse(fs.readFileSync(path.resolve(`${pathToFile}.yml`), fsEncoding))

const defineName = (name, dependencies) =>
    definePath(dependencies[name] || `../operations/${name}`)

const requireName = (name, dependencies) =>
    require(dependencies[name] || `../operations/${name}`) // eslint-disable-line global-require

module.exports = {
    defineName,
    definePath,
    requireName,
}

// TODO - resolve dependencies before runtime, so that they can be bundled
