const path = require('path')
const assignComponentChildren = require('./assignComponentChildren')
const assignComponentConnections = require('./assignComponentConnections')
const assignComponentInputs = require('./assignComponentInputs')
const assignComponentModule = require('./assignComponentModule')
const assignComponentOutput = require('./assignComponentOutput')
const assignComponentVariables = require('./assignComponentVariables')
const loadSource = require('./loadSource')

const createComponent = ({
  sourcePath,
  variables,
}) => {
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(sourcePath)
  const component = loadSource({ sourcePath })
  assignComponentVariables({
    component,
    variables,
    sourceDir,
  })
  assignComponentOutput({
    component,
    sourceDir,
  })
  if (component.operation) {
    assignComponentInputs({
      component,
      sourceDir,
    })
    assignComponentChildren({
      component,
      sourceDir,
      createComponent,
    })
    assignComponentConnections({ component })
  } else {
    assignComponentModule({
      component,
      sourceDir,
      sourceName,
    })
  }
  return component
}

module.exports = createComponent
