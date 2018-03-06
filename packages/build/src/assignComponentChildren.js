const getNameOfObjectType = require('./getNameOfObjectType')
const getReducedType = require('./getReducedType')
const getSourcePath = require('./getSourcePath')
const isDictionary = require('./isDictionary')
const mapDictionary = require('./mapDictionary')

const assignComponentChildren = ({
  component,
  sourceDir,
  buildComponent,
}) => {
  for (const key in component.children) {
    const type = component.children[key]
    const name = isDictionary(type)
      ? getNameOfObjectType({ type })
      : type
    component.children[key] = buildComponent({
      sourcePath: getSourcePath({
        name,
        imports: component.imports,
        sourceDir,
      }),
      variables: isDictionary(type)
        ? mapDictionary({
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
