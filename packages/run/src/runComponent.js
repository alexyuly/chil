const buildModuleDictionary = require('./buildModuleDictionary')
const callComponentConnections = require('./callComponentConnections')
const callComponentDefaults = require('./callComponentDefaults')
const connectedStream = require('./connectedStream')
const delegatedStream = require('./delegatedStream')

const runComponent = ({
  component,
  getLogger,
  keys = [],
  moduleDictionary = buildModuleDictionary({ component }),
}) => {
  if (component.children) {
    if (component.output) {
      Object.assign(component.output, connectedStream())
    }
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], connectedStream())
    }
    for (const key in component.children) {
      runComponent({
        component: component.children[key],
        getLogger,
        keys: keys.concat(key),
        moduleDictionary,
      })
    }
    callComponentConnections({ component })
  } else {
    if (component.output) {
      Object.assign(component.output, connectedStream({
        logger: getLogger && getLogger(keys, (value) => ({ output: value })),
      }))
    }
    const spec = moduleDictionary[component.modulePath](component)
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], delegatedStream({
        logger: getLogger && getLogger(keys, (value) => ({ [`input ${key}`]: value })),
        method: spec.methods[key],
      }))
    }
    const logger = getLogger && getLogger(keys, (value) => ({ store: value }))
    if (!component.store) {
      component.store = spec.initialStore || {}
    }
    component.write = (updates) => {
      Object.assign(component.store, updates)
      if (logger) {
        logger(component.store)
      }
    }
  }
  callComponentDefaults({ component })
}

module.exports = runComponent
