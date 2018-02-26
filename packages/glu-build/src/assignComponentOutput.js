const getReducedType = require('./getReducedType')

const assignComponentOutput = ({
  component,
  sourceDir,
}) => {
  if (!('output' in component.type.component)) {
    return
  }
  component.output = {
    reducedType: getReducedType({
      type: component.type.component.output,
      variables: component.variables,
      imports: component.imports,
      sourceDir,
    }),
  }
}

module.exports = assignComponentOutput
