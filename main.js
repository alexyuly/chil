const Application = require('./runtime/behaviors/Application')
const { definePath, } = require('./runtime/require')

const pathToFile = process.argv[2]
const definition = definePath(pathToFile)
const args = process.argv.slice(3)
new Application(definition).run(args)
