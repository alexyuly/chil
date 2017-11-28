const baseExtensionConflict = (target, base) =>
    new Error(`Target ${target.name ? `of '${target.name}'` : 'type'} conflicts with base ${base.name ? `of '${base.name}'` : 'type'}`)

const componentValueNotConnected = ({ name }, valueName) =>
    new Error(`Definition of component '${name}' contains a value '${valueName}' which has no connections`)

const constructionNotValid = ({ name }, typeInstanceName) =>
    new Error(`Specific type definition of '${name}' cannot be constructed with a parameterized type instance of '${typeInstanceName}'`)

const definitionNotRunnable = ({ name }) =>
    new Error(`Definition of '${name}' is not a runnable application`)

const definitionNotValid = ({ name }) =>
    new Error(`Definition of '${name}' is not valid`)

const eventNotValid = (event) =>
    new Error(`Event ${event}: native type ${typeof event} is not valid`)

const typeNotApplicable = (type, domain) =>
    new Error(`Type ${type}: not applicable to domain ${domain}`)

const typeNotResolved = (type) =>
    new Error(`Type ${type}: dependency is not resolved`)

const typeNotValid = (type) =>
    new Error(`Type ${type}: not valid`)

const unionTypeIllegal = (type) =>
    new Error(`Union of value types ${type} is used illegally`)

module.exports = {
    baseExtensionConflict,
    componentValueNotConnected,
    constructionNotValid,
    definitionNotRunnable,
    definitionNotValid,
    eventNotValid,
    typeNotApplicable,
    typeNotResolved,
    typeNotValid,
    unionTypeIllegal,
}
