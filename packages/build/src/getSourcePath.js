const throwError = require('./throwError')

const getSourcePath = ({
  name,
  imports,
  sourceDir = './',
}) => {
  const sourceName = `${imports && imports[name] || name}.yml`
  const sources = [
    [
      sourceName,
      { paths: [ sourceDir ] },
    ],
    [
      `@compost/lib/${sourceName}`,
      { paths: [ __dirname ] },
    ],
  ]
  for (const source of sources) {
    try {
      return require.resolve(...source)
    } catch (error) {
      // continue
    }
  }
  return throwError.typeNameFound(sourceName)
}

module.exports = getSourcePath
