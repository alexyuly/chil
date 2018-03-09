const pipe = require('../factories/pipe')

module.exports = pipe((action, next) => next(Number(action)))
