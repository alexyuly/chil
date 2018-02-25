const createComponent = require('./createComponent')
const getNameOfObjectType = require('./getNameOfObjectType')
const getSourcePath = require('./getSourcePath')
const reduceType = require('./reduceType')
const reduceTypeDictionary = require('./reduceTypeDictionary')

const assignComponentChildren = ({
  component,
  sourceDir,
}) => {
  component.children = {}
  for (const key in component.operation.children) {
    const type = component.operation.children[key]
    const isObjectType = typeof type === 'object'
    const name = isObjectType
      ? getNameOfObjectType({ type })
      : type
    component.children[key] = createComponent({
      sourcePath: getSourcePath({
        name,
        imports: component.imports,
        sourceDir,
      }),
      variables: isObjectType
        ? reduceTypeDictionary({
          dictionary: type[name],
          variables: component.variables,
          reduceType: (x) => reduceType({
            type: x,
            variables: component.variables,
            imports: component.imports,
            sourceDir,
          }),
        })
        : undefined,
    })
  }
}

module.exports = assignComponentChildren
