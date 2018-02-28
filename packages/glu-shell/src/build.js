const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const buildComponent = require('@glu/build')

const build = ({ sourcePath }) => {
  const message = chalk.green(`GLU build '${sourcePath}'`)
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(sourcePath)
  const buildPath = path.resolve(sourceDir, `${sourceName}.json`)
  const buildOutput = JSON.stringify(buildComponent({ sourcePath }))
  fs.writeFileSync(buildPath, buildOutput, 'utf8')
  console.info(chalk.yellow(`GLU build wrote file to '${buildPath}'`))
  console.timeEnd(message)
  return buildPath
}

module.exports = build
