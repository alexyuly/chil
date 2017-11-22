const { pipe } = require('../../factories')

const print = pipe((action) => console.log(action))

module.exports = print
