const Component = require('./Component')
const exceptions = require('../exceptions')

class Application extends Component {
    run(args) {
        if (!this.values.run) {
            throw new exceptions.applicationNotValid(this.definition.name)
        }
        this.values.run.next(args)
    }
}

module.exports = Application
