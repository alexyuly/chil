const fs = require('fs')
const yaml = require('js-yaml')

const getSource = ({ sourcePath }) => yaml.safeLoad(
  fs.readFileSync(
    `${sourcePath}.yml`,
    'utf8'
  )
)

module.exports = getSource
