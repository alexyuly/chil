const assert = require('assert')

const run = (component, args) => {
    assert(
        component.values.run,
        `definition of ${component.definition.name} cannot be run: expected a value named 'run'`
    )
    component.values.run.next(args)
}

module.exports = run
