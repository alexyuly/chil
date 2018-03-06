const { forEachConnection } = require('@compost/core')

const callComponentConnections = ({ component }) => {
  forEachConnection(component, (origin, target) => {
    origin.connect(target)
  })
}

module.exports = callComponentConnections
