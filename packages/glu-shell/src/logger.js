const fs = require('fs')

const logPath = process.argv[2]
const logStream = fs.createWriteStream(logPath, { flags: 'a' })
process.on('message', (message) => {
  logStream.write(`${JSON.stringify(message, null, 2)}\n`)
})
