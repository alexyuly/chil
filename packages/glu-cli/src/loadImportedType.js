const path = require('path')
const getSourcePath = require('./getSourcePath')
const loadSource = require('./loadSource')
const reduceType = require('./reduceType')

const loadImportedType = ({
  name,
  variables,
  imports,
  sourceDir,
}) => {
  const sourcePath = getSourcePath({
    name,
    imports,
    sourceDir,
  })
  const source = loadSource(sourcePath)
  return reduceType({
    type: source.type,
    variables,
    imports: source.imports,
    sourceDir: path.parse(sourcePath).dir,
  })
}

module.exports = loadImportedType
