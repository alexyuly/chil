const { forEachConnection } = require('@component-trees/core')

const callComponentConnections = ({ component }) => {
  forEachConnection(component, (origin, target) => {
    origin.connect(target)
  })
}

module.exports = callComponentConnections
