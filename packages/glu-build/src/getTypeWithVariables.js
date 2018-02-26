const getNameOfObjectType = require('./getNameOfObjectType')
const getReducedTypeDictionary = require('./getReducedTypeDictionary')

const getTypeWithVariables = ({
  type,
  variables,
}) => {
  if (!type) {
    return type
  }
  if (typeof type !== 'object') {
    return type in variables
      ? getTypeWithVariables({
        type: variables[type],
        variables,
      })
      : type
  }
  if (type instanceof Array) {
    const result = []
    for (const value of type) {
      result.push(getTypeWithVariables({
        type: value,
        variables,
      }))
    }
    return result
  }
  if ('list' in type) {
    return {
      list: getTypeWithVariables({
        type: type.list,
        variables,
      }),
    }
  }
  if (type.component) {
    return {
      component: {
        inputs: getReducedTypeDictionary({
          dictionary: type.component.inputs,
          variables,
          map: (each) => getTypeWithVariables({
            type: each,
            variables,
          }),
        }),
        output: getTypeWithVariables({
          type: type.component.output,
          variables,
        }),
      },
    }
  }
  const name = getNameOfObjectType({ type })
  return {
    [name]: getReducedTypeDictionary({
      dictionary: type[name],
      variables,
      map: (each) => getTypeWithVariables({
        type: each,
        variables,
      }),
    }),
  }
}

module.exports = getTypeWithVariables
