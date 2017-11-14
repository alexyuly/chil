function genericTemplateException(genericTemplate) {
    return new Error(`Generic template ${genericTemplate} is not a non-null object`)
}

function nativeTypeException(nativeType, value) {
    return new Error(`Native type ${nativeType} of value ${value} is not supported`)
}

function typeArgumentApplicationException(typeArgument, typeTemplate) {
    return new Error(`Type argument ${typeArgument} does not apply to templated type ${typeTemplate}`)
}

function typeArgumentsException(typeArguments) {
    return new Error(`Type arguments ${typeArguments} is not a non-null object`)
}

module.exports = {
    genericTemplateException,
    nativeTypeException,
    typeArgumentApplicationException,
    typeArgumentsException,
}
