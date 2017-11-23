const Operation = require('./behaviors/Operation')

const pipe = (reduce) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.constructValues({
            feed: (action) => {
                reduce(action, this.next)
            },
        })
    }
}

const timer = (reduce) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.queue = []
        this.constructValues({
            seed: (rate) => {
                clearInterval(this.interval)
                this.interval = setInterval(() => reduce(this.queue, this.next), rate)
            },
            feed: (action) => {
                this.queue.push(action)
            },
        })
    }
}

const valve = (reduce) => class extends Operation {
    constructor(definition, instance) {
        super(definition, instance)
        this.queue = []
        this.constructValues({
            seed: (state) => {
                this.state = state
                while (this.queue.length > 0) {
                    const action = this.queue.shift()
                    reduce(action, this.state, this.next)
                }
            },
            feed: (action) => {
                if (this.state === undefined) {
                    this.queue.push(action)
                } else {
                    reduce(action, this.state, this.next)
                }
            },
        })
    }
}

module.exports = {
    pipe,
    timer,
    valve,
}
