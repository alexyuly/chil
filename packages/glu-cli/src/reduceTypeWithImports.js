const getNameOfObjectType = require('./getNameOfObjectType')
const loadImportedType = require('./loadImportedType')
const reducedTypeNames = require('./reducedTypeNames')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const reduceTypeWithImports = ({
  type,
  imports,
  sourceDir,
}) => {
  if (!type || reducedTypeNames.includes(type)) {
    return type
  }
  if (typeof type !== 'object') {
    return loadImportedType({
      name: type,
      imports,
      sourceDir,
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
  if ('complex' in type) {
    return {
      complex: reduceTypeDictionary({
        dictionary: type.complex,
        reduceType: (x) => reduceTypeWithImports({
          type: x,
          imports,
          sourceDir,
        }),
      }),
    }
  }
  if (type.component) {
    return {
      component: {
        inputs: reduceTypeDictionary({
          dictionary: type.component.inputs,
          reduceType: (x) => reduceTypeWithImports({
            type: x,
            imports,
            sourceDir,
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
  const name = getNameOfObjectType(type)
  return loadImportedType({
    name,
    variables: reduceTypeDictionary({
      dictionary: type[name],
      reduceType: (x) => reduceTypeWithImports({
        type: x,
        imports,
        sourceDir,
      }),
    }),
    imports,
    sourceDir,
  })
}

module.exports = reduceTypeWithImports
