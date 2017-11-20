const pipe = require('../runtime/pipe')

const negate = pipe((next, action) => next(-action))

module.exports = negate
