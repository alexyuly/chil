const { timer } = require('../../factories')

const throttle = timer((queue, next) => next(queue.shift()))

module.exports = throttle
