module.exports = (component) => ({
  initialStore: {
    state: {},
  },
  methods: Object
    .keys(component.variables)
    .reduce(
      (result, methodKey) => {
        result[methodKey] = (value) => {
          component.write({
            state: Object.assign(
              {},
              component.store.state,
              { [methodKey]: value }
            ),
          })
          if (component.store.readyToOutput) {
            component.output.next(component.store.state)
          } else if (Object
            .keys(component.variables)
            .every((key) => key in component.store.state)) {
            component.write({ readyToOutput: true })
            component.output.next(component.store.state)
          }
        }
        return result
      },
      {}
    ),
})
