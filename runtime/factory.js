const Operation = require('./behaviors/Operation')

const batch = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.queue = []
        this.constructValues({
            state: (rate) => {
                clearInterval(this.interval)
                this.interval = setInterval(() => delegate(this), rate)
            },
            action: (action) => {
                this.queue.push(action)
            },
        })
    }
}

const pipe = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.constructValues({
            action: (action) => {
                delegate(this, action)
            },
        })
    }
}

const store = (delegate) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.queue = []
        this.constructValues({
            state: (state) => {
                this.state = state
                while (this.queue.length > 0) {
                    delegate(this)
                }
            },
            action: (action) => {
                this.queue.push(action)
                if (this.state !== undefined) {
                    delegate(this)
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
