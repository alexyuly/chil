#!/usr/bin/env node

const build = require('./build')
const run = require('./run')

const command = process.argv[2]
const sourcePath = process.argv[3]
if (command === 'build') {
  build({ sourcePath })
} else if (command === 'run') {
  run({
    sourcePath,
    args: process.argv.slice(4),
  })
} else {
  throw new Error(`GLU received an unknown command: '${command}'.`)
}
