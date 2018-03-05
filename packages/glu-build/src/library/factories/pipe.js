module.exports = (reduce) => ({ output }) => ({
  methods: {
    action: (action) => {
      reduce(action, output.next)
    },
  },
})
