const path = require('path')
const getReducedType = require('./getReducedType')
const getSource = require('./getSource')
const getSourcePath = require('./getSourcePath')

const getReducedTypeImport = ({
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
  const source = getSource(sourcePath)
  return getReducedType({
    type: source.type,
    variables,
    imports: source.imports,
    sourceDir: path.parse(sourcePath).dir,
  })
}

module.exports = getReducedTypeImport
