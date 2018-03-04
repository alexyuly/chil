const restoreStateFromLogs = ({
  component,
  keys = [],
  logs,
}) => {
  if (component.children) {
    for (const key in component.children) {
      restoreStateFromLogs({
        component: component.children[key],
        keys: keys.concat(key),
        logs,
      })
    }
  } else {
    for (const log of logs) {
      if (log.keys.toString() === keys.toString()) {
        component.state = log.state
        break
      }
    }
  }
}

module.exports = restoreStateFromLogs
