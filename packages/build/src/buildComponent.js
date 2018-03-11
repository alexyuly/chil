const path = require('path')
const assignComponentImplementation = require('./assignComponentImplementation')
const assignComponentInputs = require('./assignComponentInputs')
const assignComponentOutput = require('./assignComponentOutput')
const buildSource = require('./buildSource')
const getReducedType = require('./getReducedType')

const buildComponent = ({
  sourcePath,
  variables,
}) => {
  const { dir } = path.parse(sourcePath)
  const component = buildSource({
    sourcePath,
    variables,
    getReducedType,
  })
  assignComponentOutput({
    component,
    sourceDir: dir,
  })
  assignComponentInputs({
    component,
    sourceDir: dir,
  })
  assignComponentImplementation({
    component,
    sourcePath,
    buildComponent,
  })
  return component
}

module.exports = buildComponent
