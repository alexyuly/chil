const callComponentDefaults = ({ component }) => {
  if (component.defaults) {
    for (const targetKey in component.defaults) {
      const target = component.inputs[targetKey] || component.children[targetKey].output
      const value = component.defaults[targetKey]
      target.next(value)
    }
  }
}

module.exports = callComponentDefaults
