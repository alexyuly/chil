const buildSource = require('./buildSource')
const getSourcePath = require('./getSourcePath')

const getImportedType = ({
  name,
  variables,
  imports,
  sourceDir,
  getReducedType,
}) => {
  const source = buildSource({
    sourcePath: getSourcePath({
      name,
      imports,
      sourceDir,
    }),
    variables,
    getReducedType,
  })
  return source.type
}

module.exports = getImportedType
