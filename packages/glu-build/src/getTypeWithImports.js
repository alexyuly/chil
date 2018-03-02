const getImportedType = require('./getImportedType')
const getNameOfObjectType = require('./getNameOfObjectType')
const mapDictionary = require('./mapDictionary')
const reducedTypeNames = require('./reducedTypeNames')

const getTypeWithImports = ({
  type,
  imports,
  sourceDir,
  getReducedType,
}) => {
  if (!type) {
    return null
  }
  if (reducedTypeNames.includes(type)) {
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
      complex: mapDictionary({
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
    const component = {
      inputs: mapDictionary({
        dictionary: type.component.inputs,
        map: (each) => getTypeWithImports({
          type: each,
          imports,
          sourceDir,
          getReducedType,
        }),
      }),
    }
    if ('output' in type.component) {
      component.output = getTypeWithImports({
        type: type.component.output,
        imports,
        sourceDir,
        getReducedType,
      })
    }
    return { component }
  }
  const name = getNameOfObjectType({ type })
  return getImportedType({
    name,
    variables: mapDictionary({
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
