const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const runComponent = require('@component-trees/run')
const getLogs = require('./getLogs')
const getLogger = require('./getLogger')
const restoreLogs = require('./restoreLogs')
const runShellArgs = require('./runShellArgs')
const getBuildArtifact = require('../getBuildArtifact')

const run = ({
  sourcePath,
  args,
}) => {
  const buildPath = getBuildArtifact({ sourcePath })
  const message = chalk.green(`tree run ${buildPath}`)
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const rootComponent = JSON.parse(fs.readFileSync(buildPath, 'utf8'))
  const logPath = path.resolve(sourceDir, `${sourceName}.log`)
  const logs = getLogs({ logPath })
  if (logs) {
    restoreLogs({
      component: rootComponent,
      logs,
    })
  }
  runComponent({
    component: rootComponent,
    getLogger: getLogger({ logPath }),
  })
  runShellArgs({
    component: rootComponent,
    args,
  })
  console.timeEnd(message)
}

module.exports = run
