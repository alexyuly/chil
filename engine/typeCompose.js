module.exports =
    function typeCompose(type, parameters) {
        if (typeof type === 'string') {
            return typeCompose(parameters[type], parameters) || type
        }
        if (typeof type === 'object') {
            if (type !== null) {
                const keys = Object.keys(type)
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    type[key] = typeCompose(type[key], parameters)
                }
            }
            return type
        }
        throw new Error('Type must be string or object')
    }
