const path = require('path')
const getNameOfObjectType = require('./getNameOfObjectType')
const getSourcePath = require('./getSourcePath')
const loadSource = require('./loadSource')
const reducedTypeNames = require('./reducedTypeNames')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const reducer = ({
  imports,
  sourceDir,
  reduceTypeWithImports,
}) => (type) => reduceTypeWithImports({
  type,
  imports,
  sourceDir,
})
const loadAndReduceType = ({
  name,
  variables,
  imports,
  sourceDir,
  reduceTypeWithImports,
}) => {
  const sourcePath = getSourcePath({
    name,
    imports,
    sourceDir,
  })
  const source = loadSource(sourcePath)
  return reduceTypeWithImports({
    type: source.type,
    variables,
    imports: source.imports,
    sourceDir: path.parse(sourcePath).dir,
  })
}
const reduceTypeWithImports = ({
  type,
  imports,
  sourceDir,
}) => {
  if (!type || reducedTypeNames.includes(type)) {
    return type
  }
  if (typeof type !== 'object') {
    return loadAndReduceType({
      name: type,
      imports,
      sourceDir,
      reduceTypeWithImports,
    })
  }
  if (type instanceof Array) {
    const result = []
    for (const value of type) {
      result.push(reduceTypeWithImports({
        type: value,
        imports,
        sourceDir,
      }))
    }
    return result
  }
  if ('list' in type) {
    return {
      list: reduceTypeWithImports({
        type: type.list,
        imports,
        sourceDir,
      }),
    }
  }
  if (type.component) {
    return {
      component: {
        inputs: reduceTypeDictionary({
          dictionary: type.component.inputs,
          reduceType: reducer({
            imports,
            sourceDir,
            reduceTypeWithImports,
          }),
        }),
        output: reduceTypeWithImports({
          type: type.component.output,
          imports,
          sourceDir,
        }),
      },
    }
  }
  if ('complex' in type) {
    return {
      complex: reduceTypeDictionary({
        dictionary: type.complex,
        reduceType: reducer({
          imports,
          sourceDir,
          reduceTypeWithImports,
        }),
      }),
    }
  }
  const name = getNameOfObjectType(type)
  return loadAndReduceType({
    name,
    variables: reduceTypeDictionary({
      dictionary: type[name],
      reduceType: reducer({
        imports,
        sourceDir,
        reduceTypeWithImports,
      }),
    }),
    imports,
    sourceDir,
    reduceTypeWithImports,
  })
}

module.exports = reduceTypeWithImports
