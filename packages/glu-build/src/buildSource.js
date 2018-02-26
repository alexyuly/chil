const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const checkReducedType = require('./checkReducedType')
const isNonNullObject = require('./isNonNullObject')
const getExtendedType = require('./getExtendedType')

const buildSource = ({
  variables,
  sourcePath,
  getReducedType,
}) => {
  const source = yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'))
  const { dir: sourceDir } = path.parse(sourcePath)
  if (isNonNullObject(variables)) {
    if (!isNonNullObject(source.variables)) {
      source.variables = {}
    }
    for (const key in variables) {
      checkReducedType({
        reducedType: variables[key],
        reducedDomain: getReducedType({
          type: source.variables[key],
          variables: source.variables,
          imports: source.imports,
          sourceDir,
        }),
      })
      source.variables[key] = variables[key]
    }
  }
  source.type = getExtendedType({
    reducedBase: getReducedType({
      type: source.extends,
      variables: source.variables,
      imports: source.imports,
      sourceDir,
    }),
    reducedType: getReducedType({
      type: source.type,
      variables: source.variables,
      imports: source.imports,
      sourceDir,
    }),
  })
  return source
}

module.exports = buildSource
