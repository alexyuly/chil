const buildModuleDictionary = require('./buildModuleDictionary')
const runComponentConnections = require('./runComponentConnections')
const runComponentEvents = require('./runComponentEvents')
const stream = require('./stream')

const runComponent = ({
  component,
  keys = [],
  moduleDictionary = buildModuleDictionary({ component }),
  willReceiveNext,
}) => {
  if (component.output) {
    Object.assign(component.output, stream({ willReceiveNext: willReceiveNext(component, keys) }))
  }
  if (component.children) {
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], stream())
    }
    for (const key in component.children) {
      runComponent({
        component: component.children[key],
        keys: keys.concat(key),
        moduleDictionary,
        willReceiveNext,
      })
    }
    runComponentConnections({ component })
  } else {
    const moduleMethods = moduleDictionary[component.modulePath](component)
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], stream({ delegateNext: moduleMethods[key] }))
    }
  }
  if (component.events) {
    runComponentEvents({ component })
  }
}

module.exports = runComponent
