const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const checkTypeInDomain = require('./checkTypeInDomain')
const getExtendedType = require('./getExtendedType')
const isDictionary = require('./isDictionary')

const buildSource = ({
  variables,
  sourcePath,
  getReducedType,
}) => {
  const source = yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'))
  const { dir: sourceDir } = path.parse(sourcePath)
  if (isDictionary(variables)) {
    if (!isDictionary(source.variables)) {
      source.variables = {}
    }
    for (const key in variables) {
      checkTypeInDomain({
        type: variables[key],
        domain: getReducedType({
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
    type: getReducedType({
      type: source.type,
      variables: source.variables,
      imports: source.imports,
      sourceDir,
    }),
    base: getReducedType({
      type: source.extends,
      variables: source.variables,
      imports: source.imports,
      sourceDir,
    }),
  })
  return source
}

module.exports = buildSource
