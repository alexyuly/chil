const componentValueNotConnected = ({ name }, valueName) =>
    new Error(`Definition of component '${name}' contains a value '${valueName}' which has no connections`)

const definitionNotRunnable = ({ name }) =>
    new Error(`Definition of '${name}' is not a runnable application`)

const definitionNotValid = ({ name }) =>
    new Error(`Definition of '${name}' is not valid`)

const eventNotValid = (event) =>
    new Error(`Event ${event}: native type ${typeof event} is not valid`)

const extensionConflict = (output, input, key) =>
    new Error(`Extension output of '${output.name}': conflicts with input of '${input.name}' at key '${key}'`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotResolved = (type) =>
    new Error(`Type ${type}: dependency is not resolved`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

const typeParametersNotApplicable = ({ name }, type) =>
    new Error(`Parameters of type ${type}: not applicable to definition of '${name}'`)

const unionTypeIllegal = (type) =>
    new Error(`Union of value types ${type} is used illegally`)

module.exports = {
    componentValueNotConnected,
    definitionNotRunnable,
    definitionNotValid,
    eventNotValid,
    extensionConflict,
    typeNotApplicable,
    typeNotResolved,
    typeNotValid,
    typeParametersNotApplicable,
    unionTypeIllegal,
}
