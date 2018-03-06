const isDictionary = require('./isDictionary')

const mapDictionary = ({
  dictionary,
  variables,
  map = (type) => type,
}) => {
  const target = dictionary === 'variables'
    ? variables
    : dictionary
  const result = {}
  if (isDictionary(target)) {
    for (const key in target) {
      result[key] = map(target[key])
    }
  }
  return result
}

module.exports = mapDictionary
