const assertTypeOfType = (subtype, type) => {
  if (!type || subtype === type) return
  // TODO
  throw new Error(`Type ${JSON.stringify(type)} does not have member type ${JSON.stringify(subtype)}`)
}

module.exports = assertTypeOfType
