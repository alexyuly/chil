#!/usr/bin/env node

const callComponent = require('./callComponent')
const createComponent = require('./createComponent')

callComponent({
  component: createComponent({ sourcePath: process.argv[2] }),
  args: process.argv.slice(3),
})
