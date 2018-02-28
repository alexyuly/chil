const getNameOfObjectType = require('./getNameOfObjectType')
const getReducedType = require('./getReducedType')
const getReducedTypeDictionary = require('./getReducedTypeDictionary')
const getSourcePath = require('./getSourcePath')
const isNonNullObject = require('./isNonNullObject')

const assignComponentChildren = ({
  component,
  sourceDir,
  buildComponent,
}) => {
  for (const key in component.children) {
    const type = component.children[key]
    const isObjectType = isNonNullObject(type)
    const name = isObjectType
      ? getNameOfObjectType({ type })
      : type
    component.children[key] = buildComponent({
      sourcePath: getSourcePath({
        name,
        imports: component.imports,
        sourceDir,
      }),
      variables: isObjectType
        ? getReducedTypeDictionary({
          dictionary: type[name],
          variables: component.variables,
          map: (each) => getReducedType({
            type: each,
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
