const fs = require('fs')
const yaml = require('js-yaml')

const getSource = (sourcePath) => {
  return yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'))
}

module.exports = getSource
