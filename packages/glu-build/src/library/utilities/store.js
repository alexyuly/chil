module.exports = (fn) => (component) => {
  if (component.state === undefined) {
    component.state = {
      state: undefined,
      actions: [],
    }
  }
  return {
    action: (action) => {
      if (component.state.state === undefined) {
        component.state.actions.push(action)
      } else {
        fn(component.state.state, action, component.output.next)
      }
    },
    state: (nextState) => {
      component.state.state = nextState
      while (component.state.actions.length > 0) {
        const action = component.state.actions.shift()
        fn(component.state.state, action, component.output.next)
      }
    },
  }
}
