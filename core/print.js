const { pipe } = require('../runtime/factories')

const print = pipe((action) => console.log(action))

module.exports = print
