const stream = require('./stream')

const assignComponentInputs = ({
  component,
  delegateMethods,
  keys = [],
  willReceiveNext,
}) => {
  for (const key in component.inputs) {
    Object.assign(component.inputs[key], stream({
      delegateNext: delegateMethods && delegateMethods[key],
      willReceiveNext: willReceiveNext && keys.length === 0
        ? willReceiveNext(component, [ key ])
        : undefined,
    }))
  }
}

module.exports = assignComponentInputs
