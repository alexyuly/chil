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

const valueNotApplicable = (value, name) =>
    new Error(`Value of '${value}': not applicable to name '${name}'`)

module.exports = {
    definitionArgumentsNotExpected,
    definitionArgumentsNotValid,
    definitionGenericNotValid,
    nativeTypeNotValid,
    typeNotApplicable,
    typeNotValid,
    valueNotApplicable,
}
