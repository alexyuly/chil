const getImportedType = require('./getImportedType')
const getNameOfObjectType = require('./getNameOfObjectType')
const getReducedTypeDictionary = require('./getReducedTypeDictionary')
const reducedTypeNames = require('./reducedTypeNames')

const getTypeWithImports = ({
  type,
  imports,
  sourceDir,
  getReducedType,
}) => {
  if (!type || reducedTypeNames.includes(type)) {
    return type
  }
  if (typeof type !== 'object') {
    return getImportedType({
      name: type,
      imports,
      sourceDir,
      getReducedType,
    })
  }
  if (type instanceof Array) {
    const result = []
    for (const value of type) {
      result.push(getTypeWithImports({
        type: value,
        imports,
        sourceDir,
        getReducedType,
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
        getReducedType,
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
          getReducedType,
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
            getReducedType,
          }),
        }),
        output: getTypeWithImports({
          type: type.component.output,
          imports,
          sourceDir,
          getReducedType,
        }),
      },
    }
  }
  const name = getNameOfObjectType({ type })
  return getImportedType({
    name,
    variables: getReducedTypeDictionary({
      dictionary: type[name],
      map: (each) => getTypeWithImports({
        type: each,
        imports,
        sourceDir,
        getReducedType,
      }),
    }),
    imports,
    sourceDir,
    getReducedType,
  })
}

module.exports = getTypeWithImports
