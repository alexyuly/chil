const stream = require('./stream')

const assignComponentInputs = ({
  component,
  delegateMethods,
}) => {
  for (const key in component.inputs) {
    Object.assign(
      component.inputs[key],
      stream({ delegateNext: delegateMethods && delegateMethods[key] })
    )
  }
}

module.exports = assignComponentInputs
