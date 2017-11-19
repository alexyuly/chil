const Source = require('./Source')

class Operation extends Source {
    constructor(definition, typeArguments, sources) {
        super(definition, typeArguments)
        this.sources = sources
    }
}

module.exports = Operation
