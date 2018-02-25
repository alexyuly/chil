const isNonNullObject = require('./isNonNullObject')

const reduceTypeDictionary = ({
  dictionary,
  variables,
  reduceType = (type) => type,
}) => {
  const target = dictionary === 'variables'
    ? variables
    : dictionary
  const result = {}
  if (isNonNullObject(target)) {
    for (const key in target) {
      result[key] = reduceType(target[key])
    }
  }
  return result
}

module.exports = reduceTypeDictionary
