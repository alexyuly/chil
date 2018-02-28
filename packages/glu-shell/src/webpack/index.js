const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const compile = require('webpack')
const buildWebpackEntry = require('./buildWebpackEntry')

const webpack = ({ buildPath }) => {
  const message = chalk.green(`GLU webpack '${buildPath}'`)
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const entryPath = path.resolve(sourceDir, `${sourceName}_entry.js`)
  fs.writeFileSync(entryPath, buildWebpackEntry({ buildPath }), 'utf8')
  const webpackConfig = {
    entry: entryPath,
    output: {
      path: sourceDir,
      filename: `${sourceName}.js`,
    },
  }
  compile(webpackConfig, (error, stats) => {
    if (error) {
      console.error(error)
    } else if (stats.hasErrors()) {
      stats.compilation.errors.forEach(console.error)
    } else {
      const outputPath = path.resolve(webpackConfig.output.path, webpackConfig.output.filename)
      console.info(chalk.yellow(`GLU webpack wrote file to '${outputPath}'`))
    }
    fs.unlinkSync(entryPath)
    console.timeEnd(message)
  })
}

module.exports = webpack
