const buildModuleDictionary = require('./buildModuleDictionary')
const callComponentConnections = require('./callComponentConnections')
const callComponentDefaults = require('./callComponentDefaults')
const connectedStream = require('./connectedStream')
const delegatedStream = require('./delegatedStream')

const runConnections = ({
  component,
  getLogger,
  keys = [],
  moduleDictionary,
}) => {
  if (component.children) {
    if (component.output) {
      Object.assign(component.output, connectedStream())
    }
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], connectedStream())
    }
    for (const key in component.children) {
      runConnections({
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
}
const runDefaults = ({ component }) => {
  if (component.children) {
    for (const key in component.children) {
      runDefaults({
        component: component.children[key],
      })
    }
  }
  callComponentDefaults({ component })
}
const runComponent = ({
  component,
  getLogger,
  moduleDictionary = buildModuleDictionary({ component }),
}) => {
  runConnections({
    component,
    getLogger,
    moduleDictionary,
  })
  runDefaults({ component })
}

module.exports = runComponent
