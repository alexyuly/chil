const { buildModuleDictionary } = require('@glu/build')
const runComponentConnections = require('./runComponentConnections')
const runComponentEvents = require('./runComponentEvents')
const stream = require('./stream')

const runComponent = ({
  component,
  componentLogger,
  componentPath = [],
  moduleDictionary = buildModuleDictionary({ component }),
}) => {
  if (component.output) {
    Object.assign(component.output, stream())
  }
  if (component.composition) {
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], stream())
    }
    for (const key in component.children) {
      runComponent({
        component: component.children[key],
        componentLogger,
        componentPath: componentPath.concat(key),
        moduleDictionary,
      })
    }
    runComponentConnections({ component })
  } else {
    const moduleMethods = moduleDictionary[component.modulePath](component)
    for (const key in component.inputs) {
      const method = moduleMethods[key]
      const delegate = componentLogger
        ? (event) => {
          const begin = Date.now()
          method(event)
          componentLogger.send({
            begin,
            end: Date.now(),
            path: componentPath.concat(key),
            state: component.state,
            event,
          })
        }
        : method
      Object.assign(component.inputs[key], stream(delegate))
    }
  }
  if (component.events) {
    runComponentEvents({ component })
  }
}

module.exports = runComponent
