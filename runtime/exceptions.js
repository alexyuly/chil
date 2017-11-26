const componentValueNotConnected = ({ name }, valueName) =>
    new Error(`Definition of component '${name}' contains value '${valueName}' which has no connections`)

const definitionNotRunnable = ({ name }) =>
    new Error(`Definition of '${name}' is not a runnable application`)

const definitionNotValid = ({ name }) =>
    new Error(`Definition of '${name}' is not a valid definition`)

const eventNotValid = (event) =>
    new Error(`Event ${event}: native type ${typeof event} is not valid`)

const instanceNotApplicable = (type, name) =>
    new Error(`Instance of type ${type}: not applicable to name ${name}`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

module.exports = {
    componentValueNotConnected,
    definitionNotRunnable,
    definitionNotValid,
    eventNotValid,
    instanceNotApplicable,
    typeNotApplicable,
    typeNotValid,
}
