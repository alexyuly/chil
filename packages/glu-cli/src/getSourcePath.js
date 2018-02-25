const path = require('path')

const getSourcePath = ({
  name,
  imports,
  sourceDir,
}) => path.resolve(
  sourceDir,
  imports && imports[name] || name
)

module.exports = getSourcePath
