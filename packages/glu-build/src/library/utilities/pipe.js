module.exports = (fn) => (component) => ({
  action: (event) => {
    component.output.next(fn(event))
  },
})
