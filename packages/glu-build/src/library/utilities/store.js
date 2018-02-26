module.exports = (fn) => (component) => {
  component.state = {
    actions: [],
    state: undefined,
  }
  return {
    action: (event) => {
      if (component.state.state === undefined) {
        component.state.actions.push(event)
      } else {
        component.output.next(fn(
          component.state.state,
          event
        ))
      }
    },
    state: (event) => {
      component.state.state = event
      while (component.state.actions.length > 0) {
        component.output.next(fn(
          component.state.state,
          component.state.actions.shift()
        ))
      }
    },
  }
}
