const { forEachConnection } = require('@glu/core')
const checkTypeInDomain = require('./checkTypeInDomain')

const checkComponentConnections = ({ component }) => {
  forEachConnection(component, (origin, target) => {
    checkTypeInDomain({
      type: origin.type,
      domain: target.type,
    })
  })
}

module.exports = checkComponentConnections