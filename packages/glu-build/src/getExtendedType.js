const baseTypeNames = require('./baseTypeNames')
const checkTypeInDomain = require('./checkTypeInDomain')
const getNameOfObjectType = require('./getNameOfObjectType')
const isDictionary = require('./isDictionary')
const throwError = require('./throwError')

const getExtendedType = ({
  type,
  base,
}) => {
  if (!base) {
    return type
  }
  if (!isDictionary(base)) {
    throwError.typeCanExtend(type, base)
  }
  const baseName = getNameOfObjectType({ type: base })
  if (!baseTypeNames.includes(baseName)) {
    throwError.typeCanExtend(type, base)
  }
  if (baseName === 'complex') {
    if (!(isDictionary(type) && getNameOfObjectType({ type }) === 'complex')) {
      throwError.typeCanExtend(type, base)
    }
    for (const key in type.complex) {
      checkTypeInDomain({
        type: type.complex[key],
        domain: base.complex[key],
      })
      base.complex[key] = type.complex[key]
    }
    return base
  }
  // baseName === 'component'
  if (!(isDictionary(type) && getNameOfObjectType({ type }) === 'component')) {
    throwError.typeCanExtend(type, base)
  }
  if (!isDictionary(type.component.inputs)) {
    throwError.typeValid(type)
  }
  if (!isDictionary(base.component.inputs)) {
    throwError.typeValid(base)
  }
  if ('output' in type.component) {
    checkTypeInDomain({
      type: type.component.output,
      domain: base.component.output,
    })
    base.component.output = type.component.output
  }
  for (const key in type.component.inputs) {
    checkTypeInDomain({
      type: type.component.inputs[key],
      domain: base.component.inputs[key],
    })
    base.component.inputs[key] = type.component.inputs[key]
  }
  return base
}

module.exports = getExtendedType
