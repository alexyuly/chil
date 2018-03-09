module.exports = (reduce) => (component) => ({
  initialStore: {
    state: undefined,
    waitingActions: [],
  },
  methods: {
    state: (state) => {
      const {
        output,
        store,
        write,
      } = component
      write({ state })
      while (store.waitingActions.length > 0) {
        const action = store.waitingActions[0]
        write({ waitingActions: store.waitingActions.slice(1) })
        reduce(state, action, output.next)
      }
    },
    action: (action) => {
      const {
        output,
        store,
        write,
      } = component
      if (store.state === undefined) {
        write({ waitingActions: store.waitingActions.concat(action) })
      } else {
        reduce(store.state, action, output.next)
      }
    },
  },
})
