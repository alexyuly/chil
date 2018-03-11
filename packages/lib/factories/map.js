const pipe = require('./pipe')

module.exports = (fn) => pipe((action, next) => next(fn(action)))
