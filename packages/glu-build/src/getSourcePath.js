const fs = require('fs')
const path = require('path')
const libraryDirs = require('./libraryDirs')
const throwError = require('./throwError')

const getSourcePath = ({
  name,
  imports,
  sourceDir = './',
}) => {
  const sourceName = `${imports && imports[name] || name}.yml`
  const sourcePaths = [ path.resolve(sourceDir, sourceName) ]
  for (const libraryDir of libraryDirs) {
    sourcePaths.push(path.resolve(libraryDir, sourceName))
  }
  for (const sourcePath of sourcePaths) {
    if (fs.existsSync(sourcePath)) {
      return sourcePath
    }
  }
  return throwError.typeNameFound(sourceName)
}

module.exports = getSourcePath
