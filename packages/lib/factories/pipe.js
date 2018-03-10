module.exports = (fn) => (component) => ({
  methods: {
    action: (action) => {
      fn(action, component.output.next)
    },
  },
})
