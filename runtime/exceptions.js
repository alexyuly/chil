const componentTypeNotRunnable = (name) =>
    new Error(`Component name '${name}': not runnable`)

const componentTypeNotValid = (name) =>
    new Error(`Component name '${name}': not valid`)

const componentValueNotValid = (name, value) =>
    new Error(`Component name '${name}': value ${value} is not valid`)

const eventNotValid = (event) =>
    new Error(`Event ${event}: native type ${typeof event} is not valid`)

const instanceNotApplicable = (type, name) =>
    new Error(`Instance of type ${type}: not applicable to name ${name}`)

const operationTypeNotValid = (name) =>
    new Error(`Operation name '${name}': not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

module.exports = {
    componentTypeNotRunnable,
    componentTypeNotValid,
    componentValueNotValid,
    eventNotValid,
    instanceNotApplicable,
    operationTypeNotValid,
    typeNotApplicable,
    typeNotValid,
}
