const buildModuleDictionary = ({ component }) => {
  const dictionary = {}
  if (component.children) {
    for (const key in component.children) {
      const child = component.children[key]
      Object.assign(dictionary, buildModuleDictionary({ component: child }))
    }
  } else {
    dictionary[component.modulePath] = require(component.modulePath)
  }
  return dictionary
}

module.exports = buildModuleDictionary
