const { pipe } = require('../../factories')

const print = pipe((operation, action) => console.log(action))

module.exports = print
