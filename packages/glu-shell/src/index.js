#!/usr/bin/env node

const path = require('path')
const build = require('./build')
const run = require('./run')
const webpack = require('./webpack')

const command = process.argv[2]
const sourcePath = process.argv[3]
if (command === 'build') {
  build({ sourcePath })
} else {
  const buildPath = path.parse(sourcePath).ext === '.json'
    ? sourcePath
    : build({ sourcePath })
  if (command === 'webpack') {
    webpack({ buildPath })
  } else if (command === 'run') {
    run({
      buildPath,
      args: process.argv.slice(4),
    })
  } else {
    throw new Error(`GLU does not recognize command '${command}'.`)
  }
}
