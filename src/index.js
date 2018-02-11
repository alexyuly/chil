#!/usr/bin/env node

const callComponent = require('./callComponent')
const compiledComponent = require('./compiledComponent')
const runWithTime = require('./runWithTime')

let component

runWithTime('compiled component', () => {
  const sourcePath = process.argv[2]
  component = compiledComponent(sourcePath)
})

runWithTime('called component', () => {
  const args = process.argv.slice(3)
  callComponent(component, args)
})
