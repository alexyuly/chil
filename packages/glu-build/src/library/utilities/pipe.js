module.exports = (fn) => (component) => ({
  action: (event) => {
    fn(event, component.output.next)
  },
})
