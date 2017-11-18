function broadcastTypeApplication(eventType, sinkType) {
    return new Error(`Event of type ${eventType} does not apply to sink of type ${sinkType}`)
}

function connectTypeApplication(sinkType, sourceType) {
    return new Error(`Sink of type ${sinkType} does not apply to source of type ${sourceType}`)
}

function definitionParse(name, path) {
    return new Error(`Definition of '${name}' at ${path} cannot be parsed`)
}

function definitionPath(name, path) {
    return new Error(`Definition of '${name}' at ${path} cannot be resolved`)
}

function genericTemplateFormat(genericTemplate) {
    return new Error(`Generic template ${genericTemplate} is not a non-null object`)
}

function nativeType(nativeType, value) {
    return new Error(`Native type ${nativeType} of value ${value} is not supported`)
}

function typeArgumentApplication(typeArgument, domain) {
    return new Error(`Type argument ${typeArgument} does not apply to domain ${domain}`)
}

function typeArgumentFormat(typeArguments) {
    return new Error(`Type arguments ${typeArguments} is not a non-null object`)
}

module.exports = {
    broadcastTypeApplication,
    connectTypeApplication,
    definitionParse,
    definitionPath,
    genericTemplateFormat,
    nativeType,
    typeArgumentApplication,
    typeArgumentFormat,
}
