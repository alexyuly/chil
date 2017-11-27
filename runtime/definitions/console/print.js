const { pipe } = require('../../factory')

const print = pipe((operation, action) => console.log(action))

module.exports = print
