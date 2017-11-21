const Component = require('./runtime/behaviors/Component')
const define = require('./runtime/define')
const run = require('./runtime/run')

const path = process.argv[2]
const args = process.argv.slice(3)
run(new Component(define(path)), args)
