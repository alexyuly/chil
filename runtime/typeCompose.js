module.exports =
    function typeCompose(type, parameters) {
        if (typeof type === 'string') {
            return parameters[type] || type
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
        throw new Error('type must be a string or an object')
    }
