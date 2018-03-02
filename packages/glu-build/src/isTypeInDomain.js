const getNameOfObjectType = require('./getNameOfObjectType')
const isDictionary = require('./isDictionary')
const reducedTypeNames = require('./reducedTypeNames')
const throwError = require('./throwError')

const isTypeInDomain = (type, domain) => {
  if (!domain) {
    return true
  }
  const objectType = isDictionary(type)
  const objectDomain = isDictionary(domain)
  if (!objectDomain && !objectType) {
    return reducedTypeNames.some((x) => x === type && x === domain)
  }
  if (!objectDomain && objectType) {
    if (type instanceof Array) {
      return type.every((element) => isTypeInDomain(element, domain))
    }
    if (domain === 'list') {
      return getNameOfObjectType({ type }) === 'list'
    }
    if (domain === 'complex') {
      return getNameOfObjectType({ type }) === 'complex'
    }
  } else if (objectDomain && !objectType) {
    if (domain instanceof Array) {
      return domain.some((element) => isTypeInDomain(type, element))
    }
    if (type === 'list') {
      return getNameOfObjectType({ type: domain }) === 'list' && !domain.list
    }
    if (type === 'complex') {
      return getNameOfObjectType({ type: domain }) === 'complex' && !domain.complex
    }
  } else {
    const arrayType = type instanceof Array
    const arrayDomain = domain instanceof Array
    if (!arrayDomain && !arrayType) {
      const typeName = getNameOfObjectType({ type })
      const domainName = getNameOfObjectType({ type: domain })
      if (typeName === 'list' && domainName === 'list') {
        return isTypeInDomain(type.list, domain.list)
      }
      if (typeName === 'complex' && domainName === 'complex') {
        if (!isDictionary(type.complex)) {
          throwError.typeValid(type)
        }
        if (!isDictionary(domain.complex)) {
          throwError.typeValid(domain)
        }
        return Object
          .keys(domain.complex)
          .every((key) => isTypeInDomain(type.complex[key], domain.complex[key]))
      }
      if (typeName === 'component' && domainName === 'component') {
        if (!isDictionary(type.component.inputs)) {
          throwError.typeValid(type)
        }
        if (!isDictionary(domain.component.inputs)) {
          throwError.typeValid(domain)
        }
        return isTypeInDomain(type.component.output, domain.component.output) && Object
          .keys(domain.component.inputs)
          .every((key) => isTypeInDomain(type.component.inputs[key], domain.component.inputs[key]))
      }
    } else if (!arrayDomain && arrayType) {
      return type.every((element) => isTypeInDomain(element, domain))
    } else if (arrayDomain && !arrayType) {
      return domain.some((element) => isTypeInDomain(type, element))
    } else {
      return type.every((typeElement) =>
        domain.some((domainElement) => isTypeInDomain(typeElement, domainElement)))
    }
  }
  return false
}

module.exports = isTypeInDomain
