const getNameOfObjectType = require('./getNameOfObjectType')
const getReducedTypeDictionary = require('./getReducedTypeDictionary')
const getReducedTypeImport = require('./getReducedTypeImport')
const reducedTypeNames = require('./reducedTypeNames')

const getTypeWithImports = ({
  type,
  imports,
  sourceDir,
}) => {
  if (!type || reducedTypeNames.includes(type)) {
    return type
  }
  if (typeof type !== 'object') {
    return getReducedTypeImport({
      name: type,
      imports,
      sourceDir,
    })
  }
  if (type instanceof Array) {
    const result = []
    for (const value of type) {
      result.push(getTypeWithImports({
        type: value,
        imports,
        sourceDir,
      }))
    }
    return result
  }
  if ('list' in type) {
    return {
      list: getTypeWithImports({
        type: type.list,
        imports,
        sourceDir,
      }),
    }
  }
  if ('complex' in type) {
    return {
      complex: getReducedTypeDictionary({
        dictionary: type.complex,
        map: (each) => getTypeWithImports({
          type: each,
          imports,
          sourceDir,
        }),
      }),
    }
  }
  if (type.component) {
    return {
      component: {
        inputs: getReducedTypeDictionary({
          dictionary: type.component.inputs,
          map: (each) => getTypeWithImports({
            type: each,
            imports,
            sourceDir,
          }),
        }),
        output: getTypeWithImports({
          type: type.component.output,
          imports,
          sourceDir,
        }),
      },
    }
  }
  const name = getNameOfObjectType(type)
  return getReducedTypeImport({
    name,
    variables: getReducedTypeDictionary({
      dictionary: type[name],
      map: (each) => getTypeWithImports({
        type: each,
        imports,
        sourceDir,
      }),
    }),
    imports,
    sourceDir,
  })
}

module.exports = getTypeWithImports
