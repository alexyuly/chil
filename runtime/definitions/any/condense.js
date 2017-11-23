const { timer } = require('../../factories')

const condense = timer((queue, next) => next(queue.splice(0).shift()))

module.exports = condense
