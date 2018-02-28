const buildModulePathSet = ({ component }) => {
  const set = new Set()
  if (component.children) {
    for (const key in component.children) {
      const child = component.children[key]
      for (const modulePath of buildModulePathSet({ component: child })) {
        set.add(modulePath)
      }
    }
  } else {
    set.add(component.modulePath)
  }
  return set
}

module.exports = buildModulePathSet
