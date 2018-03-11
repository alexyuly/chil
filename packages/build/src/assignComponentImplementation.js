const path = require('path')
const assignComponentChildren = require('./assignComponentChildren')
const checkComponentConnections = require('./checkComponentConnections')
const getNameOfObjectType = require('./getNameOfObjectType')
const getSource = require('./getSource')
const getSourcePath = require('./getSourcePath')
const isDictionary = require('./isDictionary')

const assignComponentImplementation = ({
  component,
  sourcePath,
  buildComponent,
}) => {
  if (component.children) {
    const { dir } = path.parse(sourcePath)
    assignComponentChildren({
      component,
      sourceDir: dir,
      buildComponent,
    })
    checkComponentConnections({ component })
  } else {
    const assignComponentModulePath = (nextSourcePath) => {
      const { dir, name } = path.parse(nextSourcePath)
      try {
        component.modulePath = require.resolve(path.resolve(dir, `${name}.js`))
      } catch (error) {
        const source = getSource(nextSourcePath)
        if (source.children) {
          component.children = source.children
          component.connections = source.connections
          component.defaults = Object.assign({}, source.defaults, component.defaults)
          assignComponentImplementation({
            component,
            sourcePath: nextSourcePath,
            buildComponent,
          })
        } else {
          const typeName = isDictionary(source.type)
            ? getNameOfObjectType({ type: source.type })
            : source.type
          if (typeName !== 'component') {
            assignComponentModulePath(getSourcePath({
              name: typeName,
              imports: component.imports,
              sourceDir: dir,
            }))
          }
        }
      }
    }
    assignComponentModulePath(sourcePath)
  }
}

module.exports = assignComponentImplementation
