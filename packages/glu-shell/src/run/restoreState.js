const restoreState = ({
  component,
  keys = [],
  logs,
}) => {
  for (const log of logs) {
    if (log.keys.toString() === keys.toString()) {
      component.state = log.state
      break
    }
  }
  if (component.children) {
    for (const key in component.children) {
      restoreState({
        component: component.children[key],
        keys: keys.concat(key),
        logs,
      })
    }
  }
}

module.exports = restoreState
