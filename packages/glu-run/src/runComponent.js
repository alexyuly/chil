const buildModuleDictionary = require('./buildModuleDictionary')
const callComponentConnections = require('./callComponentConnections')
const callComponentEvents = require('./callComponentEvents')
const stream = require('./stream')

const runComponent = ({
  component,
  getLogger,
  keys = [],
  moduleDictionary = buildModuleDictionary({ component }),
}) => {
  if (component.output) {
    Object.assign(component.output, stream())
  }
  if (component.children) {
    for (const key in component.inputs) {
      Object.assign(component.inputs[key], stream())
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
    const delegates = moduleDictionary[component.modulePath](component)
    const logger = getLogger && getLogger(component, keys)
    for (const key in component.inputs) {
      const delegate = delegates[key]
      Object.assign(
        component.inputs[key],
        stream(logger
          ? (event) => {
            delegate(event)
            logger(event)
          }
          : delegate)
      )
    }
  }
  callComponentEvents({ component })
}

module.exports = runComponent
