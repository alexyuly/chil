const createStream = require('./createStream')
const reduceType = require('./reduceType')

const assignComponentOutput = ({
  component,
  sourceDir,
}) => {
  if (!('output' in component.type.component)) {
    return
  }
  component.output = createStream({
    reducedType: reduceType({
      type: component.type.component.output,
      variables: component.variables,
      imports: component.imports,
      sourceDir,
    }),
  })
}

module.exports = assignComponentOutput
