const types = require('./runtime/types')
const Application = require('./runtime/behaviors/Application')

const pathToFile = process.argv[2]
const definition = types.definePath(pathToFile)
const args = process.argv.slice(3)
new Application(definition).run(args)
