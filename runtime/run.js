const assert = require('assert')

const run = (component, args) => {
    assert(
        component.streams.run,
        `definition of ${component.definition.name} cannot be run: expected a stream named 'run'`
    )
    component.streams.run.next(args)
}

module.exports = run
