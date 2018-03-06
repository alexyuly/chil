const forEachConnection = (component, fn) => {
  for (const originKey in component.connections) {
    const origin = component.inputs[originKey] || component.children[originKey].output
    const targets = component.connections[originKey]
    for (const targetKey in targets) {
      if (targetKey === 'output') {
        fn(origin, component.output)
      } else {
        const target = targets[targetKey]
        const { inputs } = component.children[targetKey]
        if (target instanceof Array) {
          for (const key of target) {
            fn(origin, inputs[key])
          }
        } else {
          fn(origin, inputs[target])
        }
      }
    }
  }
}

module.exports = forEachConnection
