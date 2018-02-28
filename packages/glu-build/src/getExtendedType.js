const assert = require('assert')
const baseTypeNames = require('./baseTypeNames')
const checkReducedType = require('./checkReducedType')
const getNameOfObjectType = require('./getNameOfObjectType')
const isDictionary = require('./isDictionary')

const getExtendedType = ({
  reducedBase,
  reducedType,
}) => {
  if (!reducedBase) {
    return reducedType
  }
  assert(
    isDictionary(reducedBase),
    'Expected base type to be a dictionary.'
  )
  const baseName = getNameOfObjectType({ type: reducedBase })
  assert(
    baseTypeNames.includes(baseName),
    'Expected base type to be a complex or component type.'
  )
  if (baseName === 'complex') {
    assert(
      isDictionary(reducedType) && getNameOfObjectType({ type: reducedType }) === 'complex',
      'Expected type to match the base type.'
    )
    for (const key in reducedType.complex) {
      checkReducedType({
        reducedType: reducedType.complex[key],
        reducedDomain: reducedBase.complex[key],
      })
      reducedBase.complex[key] = reducedType.complex[key]
    }
    return reducedBase
  }
  // baseName === 'component'
  assert(
    isDictionary(reducedType) && getNameOfObjectType({ type: reducedType }) === 'component',
    'Expected type to match the base type.'
  )
  if (reducedType.component.output) {
    checkReducedType({
      reducedType: reducedType.component.output,
      reducedDomain: reducedBase.component.output,
    })
    reducedBase.component.output = reducedType.component.output
  }
  for (const key in reducedType.component.inputs) {
    checkReducedType({
      reducedType: reducedType.component.inputs[key],
      reducedDomain: reducedBase.component.inputs[key],
    })
    reducedBase.component.inputs[key] = reducedType.component.inputs[key]
  }
  return reducedBase
}

module.exports = getExtendedType
