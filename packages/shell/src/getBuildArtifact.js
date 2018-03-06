const path = require('path')
const build = require('./build')

const getBuildArtifact = ({ sourcePath }) =>
  path.parse(sourcePath).ext === '.json'
    ? sourcePath
    : build({ sourcePath })

module.exports = getBuildArtifact
