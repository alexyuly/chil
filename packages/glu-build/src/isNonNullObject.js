const isNonNullObject = (x) =>
  typeof x === 'object' &&
  x !== null

module.exports = isNonNullObject
