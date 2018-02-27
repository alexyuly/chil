module.exports = (fn) => (component) => {
  component.state = {
    state: undefined,
    actions: [],
  }
  return {
    action: (action) => {
      const {
        state,
        actions,
      } = component.state
      if (state === undefined) {
        actions.push(action)
      } else {
        component.output.next(fn(state, action))
      }
    },
    state: (nextState) => {
      component.state.state = nextState
      const {
        state,
        actions,
      } = component.state
      while (actions.length > 0) {
        const action = actions.shift()
        component.output.next(fn(state, action))
      }
    },
  }
}
