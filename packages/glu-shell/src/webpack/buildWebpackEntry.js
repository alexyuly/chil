const fs = require('fs')
const buildModulePathSet = require('./buildModulePathSet')

const buildWebpackEntry = ({ buildPath }) => {
  const component = JSON.parse(fs.readFileSync(buildPath, 'utf8'))
  const modulePathSet = buildModulePathSet({ component })
  const moduleDictionaryTemplate = Array
    .from(modulePathSet)
    .reduce((result, modulePath) => `${result}'${modulePath}':require('${modulePath}'),`, '')
  return `
    const { runComponent } = require('${require.resolve('@glu/run')}')
    runComponent({
      component: require('${buildPath}'),
      moduleDictionary: {${moduleDictionaryTemplate}},
    })
  `
}

module.exports = buildWebpackEntry
