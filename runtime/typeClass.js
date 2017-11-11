const path = require('path')

module.exports =
    function typeClass(name) {
        return require(path.join('.', `${name}.vine`))
    }
