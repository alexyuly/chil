module.exports = (component) => ({
  initialStore: {
    readyToOutput: false,
    state: {},
  },
  methods: Object
    .keys(component.variables)
    .reduce(
      (result, methodKey) => {
        result[methodKey] = (value) => {
          const {
            output,
            store,
            variables,
            write,
          } = component
          write({ state: Object.assign({}, store.state, { [methodKey]: value }) })
          if (store.readyToOutput) {
            output.next(store.state)
          } else if (Object.keys(variables).every((key) => key in store.state)) {
            write({ readyToOutput: true })
            output.next(store.state)
          }
        }
        return result
      },
      {}
    ),
})
