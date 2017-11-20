const applicationNotValid = (name) =>
    new Error(`Application of '${name}' has no value 'run': not valid`)

const componentHierarchyNotValid = (componentName, childName) =>
    new Error(`Definition of component '${componentName}': '${childName}' is not valid`)

const definitionArgumentsNotExpected = (name) =>
    new Error(`Definition of '${name}': arguments are not expected`)

const definitionArgumentsNotValid = (name) =>
    new Error(`Definition of '${name}': arguments are not valid`)

const definitionGenericNotValid = (name) =>
    new Error(`Definition of '${name}': generic is not valid`)

const nativeTypeNotValid = (nativeType) =>
    new Error(`Native type of '${nativeType}': not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type of '${type}': not applicable to domain '${domain}'`)

const typeNotValid = (type) =>
    new Error(`Type of '${type}': not valid`)

module.exports = {
    applicationNotValid,
    componentHierarchyNotValid,
    definitionArgumentsNotExpected,
    definitionArgumentsNotValid,
    definitionGenericNotValid,
    nativeTypeNotValid,
    typeNotApplicable,
    typeNotValid,
}
