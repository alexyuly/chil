const getNameOfObjectType = require('./getNameOfObjectType')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const reducer = ({
  variables,
  reduceTypeWithVariables,
}) => (type) => reduceTypeWithVariables({
  type,
  variables,
})
const reduceTypeWithVariables = ({
  type,
  variables,
}) => {
  if (!type) {
    return type
  }
  if (typeof type !== 'object') {
    return type in variables
      ? reduceTypeWithVariables({
        type: variables[type],
        variables,
      })
      : type
  }
  if (type instanceof Array) {
    const result = []
    for (const value of type) {
      result.push(reduceTypeWithVariables({
        type: value,
        variables,
      }))
    }
    return result
  }
  if ('list' in type) {
    return {
      list: reduceTypeWithVariables({
        type: type.list,
        variables,
      }),
    }
  }
  if (type.component) {
    return {
      component: {
        inputs: reduceTypeDictionary({
          dictionary: type.component.inputs,
          variables,
          reduceType: reducer({
            variables,
            reduceTypeWithVariables,
          }),
        }),
        output: reduceTypeWithVariables({
          type: type.component.output,
          variables,
        }),
      },
    }
  }
  const name = getNameOfObjectType({ type })
  return {
    [name]: reduceTypeDictionary({
      dictionary: type[name],
      variables,
      reduceType: reducer({
        variables,
        reduceTypeWithVariables,
      }),
    }),
  }
}

module.exports = reduceTypeWithVariables
