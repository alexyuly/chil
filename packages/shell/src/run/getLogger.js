const child_process = require('child_process')
const path = require('path')

const getLogger = ({ logPath }) => {
  const logProcess = child_process.fork(path.resolve(__dirname, './logger'), [ logPath ])
  return (keys, getEvent) => (value) => {
    logProcess.send({
      time: Date.now(),
      keys,
      event: getEvent(value),
    })
  }
}

module.exports = getLogger
