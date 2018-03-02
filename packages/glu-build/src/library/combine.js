module.exports = (component) => {
  component.state = {
    state: {},
    ready: false,
  }
  const methods = {}
  for (const key in component.variables) {
    methods[key] = (event) => {
      component.state.state[key] = event
      if (!component.state.ready) {
        for (const innerKey in component.variables) {
          if (component.state.state[innerKey] === undefined) {
            return
          }
        }
        component.state.ready = true
      }
      component.output.next(component.state.state)
    }
  }
  return methods
}
