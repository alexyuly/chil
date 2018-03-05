const restoreLogs = ({
  component,
  keys = [],
  logs,
}) => {
  if (component.children) {
    for (const key in component.children) {
      restoreLogs({
        component: component.children[key],
        keys: keys.concat(key),
        logs,
      })
    }
  } else {
    const log = logs.find((x) => x.event.store && x.keys.toString() === keys.toString())
    if (log) {
      component.store = log.event.store
    }
  }
}

module.exports = restoreLogs
