const isNonNullObject = require('./isNonNullObject')

const getReducedTypeDictionary = ({
  dictionary,
  variables,
  map = (type) => type,
}) => {
  const target = dictionary === 'variables'
    ? variables
    : dictionary
  const result = {}
  if (isNonNullObject(target)) {
    for (const key in target) {
      result[key] = map(target[key])
    }
  }
  return result
}

module.exports = getReducedTypeDictionary
