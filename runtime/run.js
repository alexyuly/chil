const exceptions = require('./exceptions')

const run = (component, args) => {
    if (!component.values.run) {
        throw new exceptions.definitionNotRunnable(component.definition)
    }
    component.values.run.next(args)
}

module.exports = run
