const shortid = require('shortid')

module.exports = (component) => ({
  methods: {
    action: () => {
      component.output.next(shortid.generate())
    },
  },
})
