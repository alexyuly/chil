module.exports = (fn) => () => ({
  action: (event) => {
    fn(event)
  },
})
