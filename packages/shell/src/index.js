#!/usr/bin/env node

const build = require('./build')
const run = require('./run')
const webpack = require('./webpack')

const command = process.argv[2]
const sourcePath = process.argv[3]
if (command === 'build') {
  build({ sourcePath })
} else if (command === 'run') {
  run({
    sourcePath,
    args: process.argv.slice(4),
  })
} else if (command === 'webpack') {
  webpack({ sourcePath })
} else {
  throw new Error(`compost does not recognize command '${command}'.`)
}
