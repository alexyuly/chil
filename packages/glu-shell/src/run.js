const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const runComponent = require('@glu/run')

const run = ({
  buildPath,
  args,
}) => {
  const message = `GLU run '${buildPath}'`
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const logPath = path.resolve(sourceDir, `${sourceName}.log`)
  const component = JSON.parse(fs.readFileSync(buildPath, 'utf8'))
  runComponent({
    component,
    componentLogger: child_process.fork(path.resolve(__dirname, 'logger'), [ logPath ]),
  })
  let argInput
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg.substring(0, 2) === '--') {
      argInput = component.inputs[arg.substring(2)]
    } else if (argInput) {
      argInput.next(arg)
    }
  }
  console.timeEnd(message)
}

module.exports = run
