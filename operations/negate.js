const pipe = require('../runtime/pipe')

const negate = pipe((push, action) => push(-action))

module.exports = negate
