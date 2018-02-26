const assert = require('assert')
const baseTypeNames = require('./baseTypeNames')
const getNameOfObjectType = require('./getNameOfObjectType')
const isNonNullObject = require('./isNonNullObject')

const getExtendedType = ({
  reducedBase,
  reducedType,
}) => {
  if (!reducedBase) {
    return reducedType
  }
  assert(
    isNonNullObject(reducedBase),
    'Expected base type to be an object type.'
  )
  const baseName = getNameOfObjectType({ type: reducedBase })
  assert(
    baseTypeNames.includes(baseName),
    'Expected base type to be a complex or component type.'
  )
  if (baseName === 'complex') {
    assert(
      isNonNullObject(reducedType) && getNameOfObjectType({ type: reducedType }) === 'complex',
      'Expected type to match the base type.'
    )
    const result = { complex: {} }
    for (const key in reducedBase.complex) {
      result.complex[key] = reducedBase.complex[key]
    }
    for (const key in reducedType.complex) {
      assert(
        !(key in result),
        'Expected type to not override any properties of the base type.'
      )
      result.complex[key] = reducedType.complex[key]
    }
    return result
  }
  // baseName === 'component'
  assert(
    isNonNullObject(reducedType) && getNameOfObjectType({ type: reducedType }) === 'component',
    'Expected type to match the base type.'
  )
  const result = {
    component: {
      inputs: {},
      output: reducedBase.component.output,
    },
  }
  for (const key in reducedBase.component.inputs) {
    result.component.inputs[key] = reducedBase.component.inputs[key]
  }
  for (const key in reducedType.component.inputs) {
    assert(
      !(key in result),
      'Expected type to not override any properties of the base type.'
    )
    result.component.inputs[key] = reducedType.component.inputs[key]
  }
  return result
}

module.exports = getExtendedType
