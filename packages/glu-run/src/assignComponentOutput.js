const stream = require('./stream')

const assignComponentOutput = ({
  component,
  keys = [],
  willReceiveNext,
}) => {
  if (component.output) {
    Object.assign(
      component.output,
      stream({ willReceiveNext: willReceiveNext && willReceiveNext(component, keys) })
    )
  }
}

module.exports = assignComponentOutput
