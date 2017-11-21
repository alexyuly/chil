const componentTypeNotRunnable = (name) =>
    new Error(`Component name '${name}': not runnable`)

const componentTypeNotValid = (name) =>
    new Error(`Component name '${name}': not valid`)

const componentValueNotValid = (name, value) =>
    new Error(`Component name '${name}': value ${value} is not valid`)

const nativeTypeNotValid = (nativeType) =>
    new Error(`Native type '${nativeType}': not valid`)

const operationTypeNotValid = (name) =>
    new Error(`Operation name '${name}': not valid`)

const typeArgumentsNotExpected = (name) =>
    new Error(`Name '${name}': arguments are not expected`)

const typeArgumentsNotValid = (name) =>
    new Error(`Name '${name}': arguments are not valid`)

const typeGenericNotValid = (name) =>
    new Error(`Name '${name}': generic is not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

module.exports = {
    componentTypeNotRunnable,
    componentTypeNotValid,
    componentValueNotValid,
    nativeTypeNotValid,
    operationTypeNotValid,
    typeArgumentsNotExpected,
    typeArgumentsNotValid,
    typeGenericNotValid,
    typeNotApplicable,
    typeNotValid,
}
