const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const createExecutable = require('./createExecutable')

module.exports = (pathToYamlFile) => {
  const application = yaml.safeLoad(fs.readFileSync(pathToYamlFile, 'utf8'))
  if (application.type.operation) {
    if (application.operation) {
      // The application's operation is defined in YAML:
      // - Construct executable inputs based on the type.
      // - Construct executable components and connections based on the operation.
    } else {
      // The application's operation is defined in a Node.js module:
      // - Construct executable inputs by calling the module.
      const { dir, name } = path.parse(pathToYamlFile)
      const mapExecutableToInputs = require(path.resolve(dir, `${name}.js`))
      application.executable = createExecutable()
      application.executable.inputs = mapExecutableToInputs(application.executable)
    }
  }
  return application
}
