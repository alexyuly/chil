const path = require('path')
const checkTypeInDomain = require('./checkTypeInDomain')
const getExtendedType = require('./getExtendedType')
const getSource = require('./getSource')
const isDictionary = require('./isDictionary')

const buildSource = ({
  sourcePath,
  variables,
  getReducedType,
}) => {
  const source = getSource(sourcePath)
  const { dir } = path.parse(sourcePath)
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
          sourceDir: dir,
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
      sourceDir: dir,
    }),
    base: getReducedType({
      type: source.extends,
      variables: source.variables,
      imports: source.imports,
      sourceDir: dir,
    }),
  })
  return source
}

module.exports = buildSource
