module.exports = (fn) => (component) => {
  component.state = {
    state: undefined,
    actions: [],
  }
  return {
    action: (action) => {
      if (component.state.state === undefined) {
        component.state.actions.push(action)
      } else {
        component.output.next(fn(component.state.state, action))
      }
    },
    state: (nextState) => {
      component.state.state = nextState
      while (component.state.actions.length > 0) {
        const action = component.state.actions.shift()
        component.output.next(fn(component.state.state, action))
      }
    },
  }
}
