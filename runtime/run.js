const exceptions = require('./exceptions')

const run = (component, args) => {
    if (!component.values.run) {
        throw new exceptions.componentTypeNotRunnable(component.definition.name)
    }
    component.values.run.next(args)
}

module.exports = run
