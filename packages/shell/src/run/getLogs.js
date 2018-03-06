const chalk = require('chalk')
const fs = require('fs')
const logSeparator = require('./logSeparator')

const getLogs = ({ logPath }) => {
  let logFile
  try {
    logFile = fs.readFileSync(logPath, 'utf8')
  } catch (error) {
    console.info(chalk.yellow(`tree run ignored error while reading log file from ${logPath}`))
    return undefined
  }
  console.info(chalk.yellow(`tree run read log file from ${logPath}`))
  return logFile
    .split(logSeparator)
    .reverse()
    .slice(1)
    .map((x) => JSON.parse(x))
}

module.exports = getLogs
