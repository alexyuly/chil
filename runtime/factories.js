const Operation = require('./behaviors/Operation')

const batch = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.queue = []
        this.constructValues({
            seed: (rate) => {
                clearInterval(this.interval)
                this.interval = setInterval(() => delegate(this), rate)
            },
            feed: (action) => {
                this.queue.push(action)
            },
        })
    }
}

const pipe = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.constructValues({
            feed: (action) => {
                delegate(this, action)
            },
        })
    }
}

const store = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.backlog = []
        this.constructValues({
            seed: (state) => {
                this.state = state
                while (this.backlog.length > 0) {
                    delegate(this, this.backlog.shift())
                }
            },
            feed: (action) => {
                if (this.state === undefined) {
                    this.backlog.push(action)
                } else {
                    delegate(this, action)
                }
            },
        })
    }
}

module.exports = {
    batch,
    pipe,
    store,
}
