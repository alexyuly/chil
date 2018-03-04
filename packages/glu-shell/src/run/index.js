const chalk = require('chalk')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const runComponent = require('@glu/run')
const restoreLogs = require('./restoreLogs')
const restoreState = require('./restoreState')
const runShellArgs = require('./runShellArgs')

const run = ({
  buildPath,
  args,
}) => {
  const message = chalk.green(`GLU run ${buildPath}`)
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const rootComponent = JSON.parse(fs.readFileSync(buildPath, 'utf8'))
  const logPath = path.resolve(sourceDir, `${sourceName}.log`)
  const logs = restoreLogs({ logPath })
  if (logs) {
    restoreState({
      component: rootComponent,
      logs,
    })
    console.info(chalk.yellow(`Restored logs from ${logPath}`))
  }
  const logger = child_process.fork(path.resolve(__dirname, './logger'), [ logPath ])
  runComponent({
    component: rootComponent,
    willReceiveNext: (component, keys) => (value) => {
      logger.send({
        keys,
        state: component.state,
        time: Date.now(),
        value,
      })
    },
  })
  runShellArgs({
    component: rootComponent,
    args,
  })
  console.timeEnd(message)
}

module.exports = run
