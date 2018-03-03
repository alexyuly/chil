const chalk = require('chalk')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const runComponent = require('@glu/run')
const runShellArgs = require('./runShellArgs')

const run = ({
  buildPath,
  args,
}) => {
  const message = chalk.green(`GLU run '${buildPath}'`)
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const rootComponent = JSON.parse(fs.readFileSync(buildPath, 'utf8'))
  const logPath = path.resolve(sourceDir, `${sourceName}.log`)
  const logger = child_process.fork(path.resolve(__dirname, '../logger'), [ logPath ])
  runComponent({
    component: rootComponent,
    willReceiveNext: (component, keys) => (event) => {
      logger.send({
        event,
        keys,
        state: component.state,
        time: Date.now(),
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
