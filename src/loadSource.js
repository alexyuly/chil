const fs = require('fs')
const yaml = require('js-yaml')

const loadSource = ({ sourcePath }) => yaml.safeLoad(
  fs.readFileSync(
    `${sourcePath}.yml`,
    'utf8'
  )
)

module.exports = loadSource
