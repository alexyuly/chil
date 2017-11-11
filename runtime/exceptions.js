module.exports = {
    nativeType: function nativeTypeException(type, value) {
        return new Error(`Native type ${type} of value ${value} is not supported`)
    },
}
