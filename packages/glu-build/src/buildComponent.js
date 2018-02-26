const path = require('path')
const assignComponentChildren = require('./assignComponentChildren')
const assignComponentInputs = require('./assignComponentInputs')
const assignComponentOutput = require('./assignComponentOutput')
const buildSource = require('./buildSource')
const checkComponentConnections = require('./checkComponentConnections')
const getReducedType = require('./getReducedType')

const buildComponent = ({
  sourcePath,
  variables,
}) => {
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(sourcePath)
  const component = buildSource({
    sourcePath,
    variables,
    getReducedType,
  })
  assignComponentOutput({
    component,
    sourceDir,
  })
  assignComponentInputs({
    component,
    sourceDir,
  })
  if (component.operation) {
    assignComponentChildren({
      component,
      sourceDir,
      buildComponent,
    })
    checkComponentConnections({ component })
  } else {
    component.modulePath = path.resolve(sourceDir, `${sourceName}.js`)
  }
  return component
}

module.exports = buildComponent
