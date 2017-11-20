const pipe = require('../runtime/pipe')

const invert = pipe((next, action) => next(1 / action))

module.exports = invert
