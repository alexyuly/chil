const isTypeInDomain = require('./isTypeInDomain')
const throwError = require('./throwError')

const checkTypeInDomain = ({
  type,
  domain,
}) => {
  if (!isTypeInDomain(type, domain)) {
    throwError.typeInDomain(type, domain)
  }
}

module.exports = checkTypeInDomain
