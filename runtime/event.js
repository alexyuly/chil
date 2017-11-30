const error = (event) => {
    throw new Error(`native JavaScript type ${typeof event} of ${JSON.stringify(event)} is not recognized`)
}

const compare = (a, b) => {
    const nativeType = typeof a
    if (nativeType !== typeof b) {
        return false
    }
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return a === b
        case 'object':
        case 'undefined': {
            if (!a || !b) {
                return a === b
            }
            for (const key in a) {
                if (!compare(a[key], b[key])) {
                    return false
                }
            }
            return true
        }
        default:
            return error(a)
    }
}

const typeOf = (event) => {
    const nativeType = typeof event
    switch (nativeType) {
        case 'number':
        case 'string':
        case 'boolean':
            return nativeType
        case 'object':
        case 'undefined': {
            if (event instanceof Array) {
                const type = { vector: [] }
                const typeSet = {}
                for (const element of event) {
                    typeSet[JSON.stringify(typeOf(element))] = null
                }
                for (const typeHash in typeSet) {
                    type.vector.push(JSON.parse(typeHash))
                }
                return type
            }
            if (event) {
                const type = { struct: {} }
                for (const key in event) {
                    type.struct[key] = typeOf(event[key])
                }
                return type
            }
            return null
        }
        default:
            return error(event)
    }
}

module.exports = {
    compare,
    typeOf,
}
