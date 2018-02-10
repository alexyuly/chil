#!/usr/bin/env node

const assert = require('assert')
const createApplication = require('./createApplication')
const createApplicationArgs = require('./createApplicationArgs')

const pathToYamlFile = process.argv[2]
const application = createApplication(pathToYamlFile)

const cliArgs = process.argv.slice(3)
const applicationArgs = createApplicationArgs(cliArgs)

for (const { method, event } of applicationArgs) {
  assert(method in application.executable.inputs, `Application does not have an executable input of '${method}'`)
  application.executable.inputs[method](event)
}
