const createStream = require('./createStream')

const assignComponentOutput = ({
  component,
  sourceDir,
}) => {
  if (!('output' in component.type.component)) {
    return
  }
  component.output = createStream({
    type: component.type.component.output,
    variables: component.variables,
    imports: component.imports,
    sourceDir,
  })
}

module.exports = assignComponentOutput
