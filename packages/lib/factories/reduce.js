module.exports = (fn) => (component) => ({
  initialStore: {
    waitingActions: [],
  },
  methods: {
    state: (state) => {
      component.write({ state })
      while (component.store.waitingActions.length > 0) {
        const action = component.store.waitingActions[0]
        component.write({
          waitingActions: component.store.waitingActions.slice(1),
        })
        fn(state, action, component.output.next)
      }
    },
    action: (action) => {
      if (component.store.state === undefined) {
        component.write({
          waitingActions: component.store.waitingActions.concat(action),
        })
      } else {
        fn(component.store.state, action, component.output.next)
      }
    },
  },
})
