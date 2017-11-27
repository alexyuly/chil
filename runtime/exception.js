const componentValueNotConnected = ({ name }, valueName) =>
    new Error(`Definition of component '${name}' contains a value '${valueName}' which has no connections`)

const constructionNotValid = ({ name }, typeInstanceName) =>
    new Error(`Specific type definition of '${name}' cannot be constructed with a parameterized type instance of '${typeInstanceName}'`)

const definitionBaseConflict = ({ name }, base) =>
    new Error(`Definition of '${name}' conflicts with base definition of '${base.name}`)

const definitionNotRunnable = ({ name }) =>
    new Error(`Definition of '${name}' is not a runnable application`)

const definitionNotValid = ({ name }) =>
    new Error(`Definition of '${name}' is not a valid definition`)

const eventNotValid = (event) =>
    new Error(`Event ${event}: native type ${typeof event} is not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

module.exports = {
    componentValueNotConnected,
    constructionNotValid,
    definitionBaseConflict,
    definitionNotRunnable,
    definitionNotValid,
    eventNotValid,
    typeNotApplicable,
    typeNotValid,
}
