module.exports = (output) => ({
  action: (event) => {
    output.next(event + 1)
  },
})
