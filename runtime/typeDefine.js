const fs = require('fs')
const path = require('path')

module.exports =
    function typeDefine(name) {
        return JSON.parse(
            fs.readFileSync(
                path.join('.', `${name}.vine`),
                {
                    encoding: 'utf8'
                }
            )
        )
    }
