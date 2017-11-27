const exception = require('./exception')

const run = (component, args) => {
    if (!component.values.run) {
        throw new exception.definitionNotRunnable(component.definition)
    }
    component.values.run.next(args)
}

module.exports = run
