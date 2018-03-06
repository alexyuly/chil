const throwError = {
  typeCanExtend: (type, base) => {
    throw new Error(`Type ${JSON.stringify(type)} cannot extend type ${JSON.stringify(base)}`)
  },
  typeInDomain: (type, domain) => {
    throw new Error(`Type ${JSON.stringify(type)} is not member of type ${JSON.stringify(domain)}`)
  },
  typeNameFound: (name) => {
    throw new Error(`Name is not found in source dir or any library dir: ${name}`)
  },
  typeValid: (type) => {
    throw new Error(`Type ${JSON.stringify(type)} is not valid`)
  },
}

module.exports = throwError
