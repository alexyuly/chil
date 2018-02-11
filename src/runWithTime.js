const chalk = require('chalk')

module.exports = (message, run) => {
  const log = chalk.yellow(`[glu: ${message}]`)
  console.time(log)
  run()
  console.timeEnd(log)
  console.log()
}
