const fs = require('fs')
const path = require('path')
const compiler = require('webpack')
const buildWebpackEntry = require('./buildWebpackEntry')

const webpack = ({ buildPath }) => {
  const message = `GLU webpack '${buildPath}'`
  console.time(message)
  const {
    dir: sourceDir,
    name: sourceName,
  } = path.parse(buildPath)
  const entryPath = path.resolve(sourceDir, `${sourceName}_entry.js`)
  fs.writeFileSync(entryPath, buildWebpackEntry({ buildPath }), 'utf8')
  compiler(
    {
      entry: entryPath,
      output: {
        path: sourceDir,
        filename: `${sourceName}.js`,
      },
    },
    (error, stats) => {
      if (error) {
        console.error(error)
      } else if (stats.hasErrors()) {
        stats.compilation.errors.forEach(console.error)
      }
      fs.unlinkSync(entryPath)
      console.timeEnd(message)
    }
  )
}

module.exports = webpack
