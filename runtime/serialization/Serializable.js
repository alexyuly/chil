class Serializable {
    constructor(serialization) {
        if (serialization) {
            const reconstitution = JSON.parse(serialization)
            for (const key in reconstitution) {
                this[key] = reconstitution[key]
            }
        }
    }

    serialize() {
        return JSON.stringify(this)
    }
}

module.exports = Serializable
