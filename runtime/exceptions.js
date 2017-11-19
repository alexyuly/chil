const definitionArgumentsNotExpected = (name) =>
    new Error(`Definition of '${name}': arguments are not expected`)

const definitionArgumentsNotValid = (name) =>
    new Error(`Definition of '${name}': arguments are not valid`)

const definitionGenericNotValid = (name) =>
    new Error(`Definition of '${name}': generic is not valid`)

const nativeTypeNotValid = (nativeType) =>
    new Error(`Native type of '${nativeType}': not valid`)

const operationBehaviorNotValid = (componentName, operationName) =>
    new Error(`Definition of '${componentName}': behavior of '${operationName}' is not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type of '${type}': not applicable to domain '${domain}'`)

const typeNotValid = (type) =>
    new Error(`Type of '${type}': not valid`)

module.exports = {
    definitionArgumentsNotExpected,
    definitionArgumentsNotValid,
    definitionGenericNotValid,
    nativeTypeNotValid,
    operationBehaviorNotValid,
    typeNotApplicable,
    typeNotValid,
}
