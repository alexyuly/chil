module.exports = (component) => ({
  methods: {
    id: (id) => {
      if (component.store.type !== undefined) {
        if (component.store.id !== undefined) {
          document
            .getElementById(component.store.id)
            .removeEventListener(component.store.type, component.output.next)
        }
        document
          .getElementById(id)
          .addEventListener(component.store.type, component.output.next)
      }
      component.write({ id })
    },
    type: (type) => {
      if (component.store.id !== undefined) {
        const element = document.getElementById(component.store.id)
        element.removeEventListener(component.store.type, component.output.next)
        element.addEventListener(type, component.output.next)
      }
      component.write({ type })
    },
  },
})
