const chalk = require('chalk')
const fs = require('fs')
const logSeparator = require('./logSeparator')

const restoreLogs = ({ logPath }) => {
  let logFile
  try {
    logFile = fs.readFileSync(logPath, 'utf8')
  } catch (error) {
    console.info(chalk.yellow(`Ignored error while loading log file from ${logPath}`))
    return undefined
  }
  return logFile.split(logSeparator).reverse().slice(1).map((x) => JSON.parse(x))
}

module.exports = restoreLogs
