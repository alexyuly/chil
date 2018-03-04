const assignComponentInputs = require('./assignComponentInputs')
const assignComponentOutput = require('./assignComponentOutput')
const buildModuleDictionary = require('./buildModuleDictionary')
const callComponentConnections = require('./callComponentConnections')
const callComponentEvents = require('./callComponentEvents')

const runComponent = ({
  component,
  keys = [],
  moduleDictionary = buildModuleDictionary({ component }),
  willReceiveNext,
}) => {
  assignComponentOutput({
    component,
    keys,
    willReceiveNext,
  })
  if (component.children) {
    assignComponentInputs({ component })
    for (const key in component.children) {
      runComponent({
        component: component.children[key],
        keys: keys.concat(key),
        moduleDictionary,
        willReceiveNext,
      })
    }
    callComponentConnections({ component })
  } else {
    assignComponentInputs({
      component,
      delegateMethods: moduleDictionary[component.modulePath](component),
    })
  }
  callComponentEvents({ component })
}

module.exports = runComponent
