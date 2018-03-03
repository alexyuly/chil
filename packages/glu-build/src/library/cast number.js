const pipe = require('./utilities/pipe')

module.exports = pipe((action, next) => next(Number(action)))
