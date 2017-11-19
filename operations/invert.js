const pipe = require('../runtime/pipe')

const invert = pipe((push, action) => push(1 / action))

module.exports = invert
