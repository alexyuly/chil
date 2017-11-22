const { pipe } = require('../factories')

const negate = pipe((action, next) => next(-action))

module.exports = negate
